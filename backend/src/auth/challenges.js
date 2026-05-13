const crypto = require("crypto");

const LOGIN_CHALLENGE_TTL_MS = Number(process.env.LOGIN_CHALLENGE_TTL_MS || 5 * 60 * 1000);
const PASSWORD_RESET_TTL_MS = Number(process.env.PASSWORD_RESET_TTL_MS || 10 * 60 * 1000);
const loginChallenges = new Map();
const passwordResetChallenges = new Map();

const digest = (value) => crypto.createHash("sha256").update(String(value)).digest("hex");
const randomCode = () => String(crypto.randomInt(100000, 1000000));
const randomToken = () => crypto.randomBytes(24).toString("base64url");

const getDemoRecoveryCode = (user) =>
  `${String(user.roleName || user.role || "user").toUpperCase()}-${user.id}-RECOVERY`;

const createLoginChallenge = (user) => {
  const challengeId = crypto.randomUUID();
  const oneTimeCode = randomCode();

  loginChallenges.set(challengeId, {
    userId: user.id,
    email: user.email,
    otpDigest: digest(oneTimeCode),
    recoveryDigest: digest(getDemoRecoveryCode(user)),
    expiresAt: Date.now() + LOGIN_CHALLENGE_TTL_MS,
    attempts: 0,
  });

  return {
    challengeId,
    oneTimeCode,
    expiresAt: new Date(Date.now() + LOGIN_CHALLENGE_TTL_MS).toISOString(),
    recoveryCode: getDemoRecoveryCode(user),
  };
};

const verifyLoginChallenge = ({ challengeId, user, oneTimeCode, recoveryCode }) => {
  const challenge = loginChallenges.get(challengeId);
  if (!challenge || challenge.userId !== user.id || challenge.email !== user.email) return false;
  if (challenge.expiresAt <= Date.now() || challenge.attempts >= 3) {
    loginChallenges.delete(challengeId);
    return false;
  }

  challenge.attempts += 1;
  const accepted =
    (oneTimeCode && digest(oneTimeCode) === challenge.otpDigest) ||
    (recoveryCode && digest(recoveryCode) === challenge.recoveryDigest);

  if (accepted) loginChallenges.delete(challengeId);
  return accepted;
};

const createPasswordResetChallenge = (user) => {
  const resetToken = randomToken();
  passwordResetChallenges.set(digest(resetToken), {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + PASSWORD_RESET_TTL_MS,
    used: false,
  });

  return {
    resetToken,
    expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS).toISOString(),
  };
};

const consumePasswordResetChallenge = ({ email, resetToken }) => {
  const key = digest(resetToken);
  const challenge = passwordResetChallenges.get(key);
  if (!challenge || challenge.used || challenge.email !== email || challenge.expiresAt <= Date.now()) {
    return false;
  }

  challenge.used = true;
  passwordResetChallenges.delete(key);
  return true;
};

module.exports = {
  createLoginChallenge,
  verifyLoginChallenge,
  createPasswordResetChallenge,
  consumePasswordResetChallenge,
  getDemoRecoveryCode,
};

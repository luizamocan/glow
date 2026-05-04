const GQL_URL = "http://localhost:5000/graphql";


export async function gqlRequest(query, variables = {}) {
  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data;
}



export const SERVICES_QUERY = `
  query GetServices($page: Int, $limit: Int, $search: String) {
    services(page: $page, limit: $limit, search: $search) {
      data {
        id name price duration description image
        appointmentCount
      }
      pagination {
        page limit total totalPages hasNextPage
      }
    }
  }
`;

export const SERVICE_DETAIL_QUERY = `
  query GetService($id: ID!) {
    service(id: $id) {
      id name price duration description image
      appointmentCount
      appointments {
        id userEmail date time status rating
      }
    }
  }
`;

export const ADD_SERVICE_MUTATION = `
  mutation AddService($input: ServiceInput!) {
    addService(input: $input) {
      id name price duration description image
    }
  }
`;

export const EDIT_SERVICE_MUTATION = `
  mutation EditService($id: ID!, $input: ServiceInput!) {
    editService(id: $id, input: $input) {
      id name price duration description image
    }
  }
`;

export const DELETE_SERVICE_MUTATION = `
  mutation DeleteService($id: ID!) {
    deleteService(id: $id)
  }
`;



export const APPOINTMENTS_QUERY = `
  query GetAppointments($userEmail: String) {
    appointments(userEmail: $userEmail) {
      id serviceId userEmail date time status rating
      service { id name price duration }
    }
  }
`;

export const ADD_APPOINTMENT_MUTATION = `
  mutation AddAppointment($input: AppointmentInput!) {
    addAppointment(input: $input) {
      id serviceId userEmail date time status
      service { id name price duration }
    }
  }
`;

export const CANCEL_APPOINTMENT_MUTATION = `
  mutation CancelAppointment($id: ID!) {
    cancelAppointment(id: $id)
  }
`;

export const RATE_APPOINTMENT_MUTATION = `
  mutation RateAppointment($id: ID!, $rating: Int!) {
    rateAppointment(id: $id, rating: $rating) {
      id rating
    }
  }
`;



export const STATS_QUERY = `
  query GetStats {
    stats {
      totalServices
      totalAppointments
      avgPrice
      mostBookedService { id name price }
      appointmentsByStatus { status count }
    }
  }
`;

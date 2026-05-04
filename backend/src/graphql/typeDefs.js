const { gql } = require("graphql-tag");

const typeDefs = gql`
  type Service {
    id: ID!
    name: String!
    price: Int!
    duration: Int!
    description: String
    image: String
    appointments: [Appointment!]!
    appointmentCount: Int!
  }

  type Appointment {
    id: ID!
    serviceId: ID!
    service: Service
    userEmail: String!
    date: String!
    time: String!
    status: String!
    rating: Int
  }

  type ServicePage {
    data: [Service!]!
    pagination: Pagination!
  }

  type Pagination {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
    hasNextPage: Boolean!
  }

  type Stats {
    totalServices: Int!
    totalAppointments: Int!
    avgPrice: Float!
    mostBookedService: Service
    appointmentsByStatus: [StatusCount!]!
  }

  type StatusCount {
    status: String!
    count: Int!
  }

  type Query {
    # Services - paginated for infinite scroll
    services(page: Int, limit: Int, search: String): ServicePage!

    # Single service with its appointments (1-to-many)
    service(id: ID!): Service

    # Appointments
    appointments(userEmail: String): [Appointment!]!
    appointment(id: ID!): Appointment

    # Statistics
    stats: Stats!
  }

  type Mutation {
    # Service CRUD
    addService(input: ServiceInput!): Service!
    editService(id: ID!, input: ServiceInput!): Service!
    deleteService(id: ID!): Boolean!

    # Appointment CRUD
    addAppointment(input: AppointmentInput!): Appointment!
    updateAppointmentStatus(id: ID!, status: String!): Appointment!
    cancelAppointment(id: ID!): Boolean!
    rateAppointment(id: ID!, rating: Int!): Appointment!
  }

  input ServiceInput {
    name: String!
    price: Int!
    duration: Int!
    description: String
    image: String
  }

  input AppointmentInput {
    serviceId: ID!
    userEmail: String!
    date: String!
    time: String!
  }
`;

module.exports = typeDefs;

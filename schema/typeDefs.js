const typeDefs = `#graphql
  enum UserRole {
    OPERATOR
    VERIFIKATOR
  }

  type User {
    id: ID!
    username: String!
    role: UserRole!
    kode_unit: String!
    createdAt: String!
    updatedAt: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input EventPermissionInput {
    nama_acara: String!
    penyelenggara: String!
    jumlah_peserta: Int!
    tanggal_mulai: String!
    tanggal_selesai: String!
    jam_mulai: String
    jam_selesai: String
    lokasi: String!
    provinsi_id: Int!
    kota_id: Int!
    kategori_acara_id: Int
    biaya: String
    deskripsi: String
    dokumentasi_url: String
    pengisi_event: [PengisiEventInput!]
  }

  input PengisiEventInput {
    nama_pengisi: String!
    judul_materi: String!
  }

  type EventPermission {
    id: ID!
    nama_acara: String!
    penyelenggara: String!
    jumlah_peserta: Int!
    tanggal_mulai: String!
    tanggal_selesai: String!
    jam_mulai: String
    jam_selesai: String
    lokasi: String!
    provinsi_id: Int!
    kota_id: Int!
    kategori_acara_id: Int
    biaya: String
    deskripsi: String
    dokumentasi_url: String
    user_id: ID!
    verified_at: String
    verified_by: String
    pengisi_event: [PengisiEvent!]!
    createdAt: String!
    updatedAt: String!
  }

  type PengisiEvent {
    nama_pengisi: String!
    judul_materi: String!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type Query {
    _: String
    getEventPermissionList: [EventPermission!]!
    getEventPermissionVerifikasiList: [EventPermission!]!
    getVerifiedEventPermissions: [EventPermission!]!
  }

  type Mutation {
    login(input: LoginInput!): LoginResponse!
    createEventPermission(input: EventPermissionInput!): EventPermission!
    updateEventPermission(id: ID!, input: EventPermissionInput!): EventPermission!
    deleteEventPermission(id: ID!): Boolean!
    verifyEventPermission(id: ID!): EventPermission!
  }
`;

export default typeDefs;

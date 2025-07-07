import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import EventPermission from '../models/EventPermission.js';
import mongoose from 'mongoose';

const resolvers = {
  Query: {
    // Event publik: hanya yang sudah diverifikasi
    getVerifiedEventPermissions: async () => {
      return await EventPermission.find({ verified_at: { $ne: null } });
    },

    // Operator melihat event miliknya (semua status)
    getEventPermissionList: async (_, __, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'OPERATOR') throw new Error('Only operators can access their own event list');
      return await EventPermission.find({ user_id: context.user.id });
    },

    // Verifikator melihat event belum diverifikasi dari unit yang sama
    getEventPermissionVerifikasiList: async (_, __, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'VERIFIKATOR') throw new Error('Only verifikator can view this list');

      const events = await EventPermission.find({ verified_at: null }).populate('user_id');
      return events.filter(e => e.user_id && e.user_id.kode_unit === context.user.kode_unit);
    }
  },

  Mutation: {
    // Login untuk semua role
    login: async (_, { input }) => {
      try {
        const { username, password } = input;
        const user = await User.findOne({ username });
        if (!user) throw new Error('Invalid credentials');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');
        const token = jwt.sign(
          {
            id: user._id,
            username: user.username,
            role: user.role,
            kode_unit: user.kode_unit
          },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        return { user, token };
      } catch (err) {
        console.error('Login error:', err);
        throw new Error('Invalid credentials');
      }
    },

    // Operator membuat event
    createEventPermission: async (_, { input }, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'OPERATOR') throw new Error('Access denied. Operator role required.');

      const {
        nama_acara, penyelenggara, jumlah_peserta,
        tanggal_mulai, tanggal_selesai, jam_mulai, jam_selesai,
        lokasi, provinsi_id, kota_id, kategori_acara_id,
        biaya, deskripsi, dokumentasi_url, pengisi_event
      } = input;

      if (jumlah_peserta < 1) throw new Error('jumlah_peserta must be at least 1');
      if (new Date(tanggal_selesai) < new Date(tanggal_mulai)) throw new Error('tanggal_selesai must be after tanggal_mulai');
      if (lokasi.length < 10) throw new Error('lokasi must be at least 10 characters');

      const event = new EventPermission({
        nama_acara,
        penyelenggara,
        jumlah_peserta,
        tanggal_mulai,
        tanggal_selesai,
        jam_mulai,
        jam_selesai,
        lokasi,
        provinsi_id,
        kota_id,
        kategori_acara_id,
        biaya,
        deskripsi,
        dokumentasi_url,
        pengisi_event,
        user_id: context.user.id
      });

      await event.save();
      return event;
    },

    // Operator update event sendiri jika belum diverifikasi
    updateEventPermission: async (_, { id, input }, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'OPERATOR') throw new Error('Only operators can update their events');

      const event = await EventPermission.findOne({ _id: id, user_id: context.user.id });
      if (!event) throw new Error('Event not found');
      if (event.verified_at) throw new Error('Cannot update a verified event');

      Object.assign(event, input);
      await event.save();
      return event;
    },

    // Operator delete event sendiri jika belum diverifikasi
    deleteEventPermission: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'OPERATOR') throw new Error('Only operators can delete their events');

      const event = await EventPermission.findOne({ _id: id, user_id: context.user.id });
      if (!event) throw new Error('Event not found');
      if (event.verified_at) throw new Error('Cannot delete a verified event');

      await EventPermission.deleteOne({ _id: id });
      return true;
    },

    // Verifikator memverifikasi event dari operator se-unit
    verifyEventPermission: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (context.user.role !== 'VERIFIKATOR') throw new Error('Only verifikator can verify events');

      const event = await EventPermission.findById(id).populate('user_id');
      if (!event) throw new Error('Event not found');

      if (event.user_id.kode_unit !== context.user.kode_unit) {
        throw new Error('You are not allowed to verify this event');
      }

      if (event.verified_at) throw new Error('Event already verified');

      event.verified_at = new Date();
      event.verified_by = context.user.username;
      await event.save();
      return event;
    }
  }
};

export default resolvers;

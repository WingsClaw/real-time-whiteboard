import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      boards: {
        Row: {
          id: string;
          name: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      board_elements: {
        Row: {
          id: string;
          board_id: string;
          type: string;
          data: any;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          type: string;
          data: any;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          type?: string;
          data?: any;
          created_by?: string | null;
          created_at?: string;
        };
      };
      collaborators: {
        Row: {
          id: string;
          board_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
      };
    };
  };
};

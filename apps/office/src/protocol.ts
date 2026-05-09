/**
 * Shared protocol types for office client-server communication.
 * The server understands message *routing* but never message *content*.
 */
/** Client -> Server */
export type ClientMessage =
  | { type: 'create-room'; roomId: string }
  | { type: 'join-room'; roomId: string }
  | { type: 'relay'; payload: string }

/** Server -> Client */
export type ServerMessage =
  | { type: 'room-created'; roomId: string }
  | { type: 'room-joined'; roomId: string }
  | { type: 'peer-joined' }
  | { type: 'relay'; payload: string }
  | { type: 'peer-disconnected' }
  | { type: 'error'; message: string }

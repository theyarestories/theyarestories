export interface DBEvent {
  _id: string;
  type: "visit";
  metadata: object;
  createdAt: string;
  updatedAt: string;
}

export interface RegisteringEvent {
  type: "visit";
  metadata: object;
}

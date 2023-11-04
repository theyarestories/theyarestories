export interface Story {
  _id: string;
  protagonist: string;
  city: string;
  story: string;
  images: string[];
  avatar: string;
  isApproved: boolean;
  isHighloghted: boolean;
  dateOfBirth?: Date;
  job?: string;
}

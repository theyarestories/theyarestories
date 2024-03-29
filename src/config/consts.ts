import { DateTime } from "luxon";

const consts = {
  maxAge: 110,
  minAge: 0,
  reviewHours: 48,
  stickyBarHeightInRems: 3.5,
  twitterMaxLetters: 220,
  metaDescriptionMaxLetters: 160,
  genocideStartDate: DateTime.fromISO("2023-10-07"),
  maxUsernameLetters: 36,
  usernameRegex: /^[a-zA-Z0-9_]+$/,
  avatarSmSizeInPx: 28,
  avatarLgSizeInPx: 90,
  profileMaxStories: 4,
};

export default consts;

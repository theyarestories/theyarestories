import classNames from "@/helpers/style/classNames";

type Props = { isActive: boolean; className?: string };

function RoseSvg({ isActive, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("svg", className)}
    >
      <path
        fill={isActive ? "#75a843" : "#999"}
        d="M32.9 17.3L35.4 64h-5z"
      ></path>
      <path
        d="M27.1 45.3c6.8 3.7 5.3 10.1 5.3 10.1s-5.6 5.1-12.5 1.4c-4.7-2.5-8.8-12.4-8.8-12.4s11.2-1.6 16 .9"
        fill={isActive ? "#83bf4f" : "#bbb"}
      ></path>
      <path
        fill={isActive ? "#947151" : "#555"}
        d="M40.9 48.4l-7.3-2.1l-.1 4z"
      ></path>
      <path
        d="M25.6 22.2c3.7 9.5 5.2 14.5 11.7 14.5c6.5 0 16.3-16.6 6.9-22C35 9.4 35.3 2 35.3 2s-15.8 4.7-9.7 20.2z"
        fill={isActive ? "#871212" : "#333"}
      ></path>
      <path
        d="M45.2 24.2c-4.8 9.1-5.2 14.5-11.7 14.5s-18.3-21.8-7.8-25.1C38.7 9.5 42 4.7 42 4.7s10.3 5.9 3.2 19.5"
        fill={isActive ? "#991d1d" : "#444"}
      ></path>
      <path
        d="M46 16c0-3.9-17-7.2-20-13.3c0 0-8.2 5.9-5.1 12c1.8 3.4 25 14.5 25.1 1.3"
        fill={isActive ? "#ad2727" : "#555"}
      ></path>
      <path
        d="M36.8 19.5c10.4 13 4.8 20.8-3.7 20.8s-17.8-8.2-15.4-17.8c2.4-9.6-1-17.8-1-17.8s12.2 4.9 20.1 14.8"
        fill={isActive ? "#cc3636" : "#666"}
      ></path>
      <path
        d="M27.3 18.5c-11.8 11.9-2.1 21.7 6.4 21.7s15.4-8 15.4-17.8s2.6-15.8 2.6-15.8s-16 3.4-24.4 11.9"
        fill={isActive ? "#e24b4b" : "#777"}
      ></path>
      <path
        d="M34 36.1c13.1-.2 7.4 5-1.1 5c-20.9 0-20-18.3-20-18.3S22.3 36.2 34 36.1"
        fill={isActive ? "#75a843" : "#999"}
      ></path>
      <path
        d="M34 36.1c-3.5 1.4-12.7 3.5-4.4 5.1C46 44.5 52.9 23.4 52.9 23.4S44.5 31.8 34 36.1z"
        fill={isActive ? "#83bf4f" : "#bbb"}
      ></path>
    </svg>
  );
}

export default RoseSvg;

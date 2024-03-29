import classNames from "@/helpers/style/classNames";

type Props = {
  isActive: boolean;
  className?: string;
};

function CandleSvg({ isActive, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("svg", className)}
    >
      <title />
      <path
        d="M9,12h5a1,1,0,0,1,1,1v7.9502a0,0,0,0,1,0,0H9a0,0,0,0,1,0,0V12a0,0,0,0,1,0,0Z"
        fill={isActive ? "#ffd58c" : "#bbb"}
      />
      <path
        d="M15.9545,7.9318a3.95453,3.95453,0,1,1-7.909,0C8.04545,5.7478,10.0227,3.9773,12,2,13.9773,3.9773,15.9545,5.7478,15.9545,7.9318Z"
        fill={isActive ? "#fa6d62" : "#888"}
      />
      <path
        d="M13.8182,9.8182A2.025,2.025,0,0,1,12,12a2.025,2.025,0,0,1-1.8182-2.1818c0-1.205.9091-2.1818,1.8182-3.2727C12.9091,7.6364,13.8182,8.6132,13.8182,9.8182Z"
        fill={isActive ? "#fff4ab" : "#ccc"}
      />
      <path
        d="M13,17H8.78448A1.57657,1.57657,0,0,1,7.4326,14.6123L9,12h4Z"
        fill={isActive ? "#ffd58c" : "#bbb"}
      />
      <path
        d="M17,22H7a1,1,0,0,1-1-1H6a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1h0A1,1,0,0,1,17,22Z"
        fill="#738394"
      />
    </svg>
  );
}

export default CandleSvg;

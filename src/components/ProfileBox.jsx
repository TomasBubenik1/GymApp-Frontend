import { Avatar } from "@mui/joy";

export default function ProfileBox({ nickname, profilepic }) {
  return (
    <div className="mr-5 p-2 pb-1 bg-backgroundcolor rounded-xl flex border border-gray-700 pt-1 pr-1 pl-5">
      <Avatar
        style={{ width: "30px", height: "28px", marginTop: "2px" }}
        variant="outlined"
        src={`${profilepic}?tr=w-30,h-30`}
      />
      <h1 className="text-text font-semibold mt-1 ml-2 ">{nickname}</h1>
      <span className="material-symbols-outlined pr-4 text-white mt-2 ml-1">
        expand_more
      </span>
    </div>
  );
}

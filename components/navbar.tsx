import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full border-b-2 h-14 flex px-5 items-center justify-start fixed bg-white">
      <Link href={"/"} className=" text-2xl font-bold">
        Code<span className=" text-yellow-400">Saver</span>
      </Link>
    </div>
  );
};

export default Navbar;

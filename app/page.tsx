import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/desktop"}>
        <div className="border-2 border-black w-fit p-2">
          Login to Desktop
        </div>
      </Link>
    </div>
  )
}

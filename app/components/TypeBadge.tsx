"use client";

import { typeMap } from "@/utils/typeMap";
import Image from "next/image";

interface TypeBadgeProps {
  type: string;
}

const TypeBadge = ({ type }: TypeBadgeProps) => {
  const typeData = typeMap[type];

  if (!typeData) return null;

  return (
    <div className="flex flex-col items-center gap-2 px-2 py-1 rounded-md">
      <Image src={typeData.icon} alt={type} width={50} height={50} />
      <span className="text-white font-bold capitalize">{type}</span>
    </div>
  );
};

export default TypeBadge;

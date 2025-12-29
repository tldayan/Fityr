
"use client";

import React from "react";

interface IconProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
  fill?: string;
}

export default function Icon({ icon: IconSVG, width = 24, height = 24, className, stroke, fill }: IconProps) {
  return <IconSVG width={width} height={height} className={className} stroke={stroke} fill={fill} />;
}

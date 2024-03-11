"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageRenderer(imglink: string | undefined) {
  const [src, setSrc] = useState(imglink);
  if (src) {
    return (
      <div
        id="image-container"
        className="relative h-16 w-16 hover:scale-[6] delay-500 cursor-pointer hover:overflow-visible hover:z-10 transition-all duration-500"
      >
        <Image
          alt="product image"
          onError={() =>
            setSrc(
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABGCAYAAAAHFFAPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAERUlEQVR4nO2Z504rMRSEef83oBdFiCY6AdF7r4HQ51l8NSvOyvHdTUgAHTs5P0Yiawfs+c7YXtMHwJnQtR70aQ/ABANsRQBLsBUBbIlGD24JtgdDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhdAXg+/t7Nzk56SYmJtzV1VVhn9fXV7e+vp71GRgYcCMjI25pack9PT0V9q1Wq25sbMz19/e78fFxt7Gx4d7e3v50HjMzM9n4monjkP6fn59uf3/fVSqVbE7Dw8NuYWHB1Wq17gF8fn7uhoaGMhAUP4d9np+fc1ihCNqHTLg0TNppnPzMIvpLyBXv75aJhSf9V1ZWCsdJP+7u7tIHvLe31zCxMsBMKtuYAJn4zc1NXhg0Svqurq7m4G9vb7OUXF9fZ5/5nKvAX82nVqtlK1Cos7OzfKyXl5d5YcucDw8Ps3HW63U3NTWVPWOx8FmygDc3N/MJ0vQywJykmHNxcdHQJjBpBj8zndJ3Z2enoe/W1laejvf399JxnZ6eZoYXbSP8HZ3MVeZHePJsdnY2ezY9Pd3QlwUsXkgxJAmY6eKye3x8nBneLMFcdov2WgEsxrEA5PeE/ZkuaWOiUTAmjoNj4qriQyZcrgB8znG3M09uL1J0MjcW7eDgYPaMe3D4Ha5UbPP36+QAh8Y2A1wkmsTDk2/E7u5uvp+Fy9vHx0f+N4pMxZceHh5ymITswz06Omp7btxzZf8vKrZwVfLTPTc317uAt7e3s/48eTIl/rJPIEXfYV+287to8rt9yPxOp3A5Lkkql355zlVA5lt0mJIzh7+k9xRgmkXTKb//bwEG4E5OTvIxLS8vdzSvtbW1wgOTAW5iGoHKyfvg4KCh7TeWaAR7bqcJ5olYxsli8dtsif4GXL5ihe0/PWQhgEuoXK5HR0fbhiwHQB6YwmKzQ1YLuExqUZ+fvibV6/UcLk/38tyH/J0thMUlYy0riq5/TWpnD/bhcj9kUrkPi/xXl7KLDtl/W110VKvVBrg+5Pn5+W/dhMkNFU/5ZZcV/kUHt5quu+ig+Bogd7QyWb6H8vPi4mLW5/Hx8b/brlBs57uy9lUlgvSGZ4SyQujaq0ofcCgBzGWq1QU+9fLyov7PBnyd5Dkevuq0SmBP/LPBBDUPDDC6uwANMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKi+gdczqPQcNTxwAAAAABJRU5ErkJggg=="
            )
          }
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABGCAYAAAAHFFAPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAERUlEQVR4nO2Z504rMRSEef83oBdFiCY6AdF7r4HQ51l8NSvOyvHdTUgAHTs5P0Yiawfs+c7YXtMHwJnQtR70aQ/ABANsRQBLsBUBbIlGD24JtgdDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhdAXg+/t7Nzk56SYmJtzV1VVhn9fXV7e+vp71GRgYcCMjI25pack9PT0V9q1Wq25sbMz19/e78fFxt7Gx4d7e3v50HjMzM9n4monjkP6fn59uf3/fVSqVbE7Dw8NuYWHB1Wq17gF8fn7uhoaGMhAUP4d9np+fc1ihCNqHTLg0TNppnPzMIvpLyBXv75aJhSf9V1ZWCsdJP+7u7tIHvLe31zCxMsBMKtuYAJn4zc1NXhg0Svqurq7m4G9vb7OUXF9fZ5/5nKvAX82nVqtlK1Cos7OzfKyXl5d5YcucDw8Ps3HW63U3NTWVPWOx8FmygDc3N/MJ0vQywJykmHNxcdHQJjBpBj8zndJ3Z2enoe/W1laejvf399JxnZ6eZoYXbSP8HZ3MVeZHePJsdnY2ezY9Pd3QlwUsXkgxJAmY6eKye3x8nBneLMFcdov2WgEsxrEA5PeE/ZkuaWOiUTAmjoNj4qriQyZcrgB8znG3M09uL1J0MjcW7eDgYPaMe3D4Ha5UbPP36+QAh8Y2A1wkmsTDk2/E7u5uvp+Fy9vHx0f+N4pMxZceHh5ymITswz06Omp7btxzZf8vKrZwVfLTPTc317uAt7e3s/48eTIl/rJPIEXfYV+287to8rt9yPxOp3A5Lkkql355zlVA5lt0mJIzh7+k9xRgmkXTKb//bwEG4E5OTvIxLS8vdzSvtbW1wgOTAW5iGoHKyfvg4KCh7TeWaAR7bqcJ5olYxsli8dtsif4GXL5ihe0/PWQhgEuoXK5HR0fbhiwHQB6YwmKzQ1YLuExqUZ+fvibV6/UcLk/38tyH/J0thMUlYy0riq5/TWpnD/bhcj9kUrkPi/xXl7KLDtl/W110VKvVBrg+5Pn5+W/dhMkNFU/5ZZcV/kUHt5quu+ig+Bogd7QyWb6H8vPi4mLW5/Hx8b/brlBs57uy9lUlgvSGZ4SyQujaq0ofcCgBzGWq1QU+9fLyov7PBnyd5Dkevuq0SmBP/LPBBDUPDDC6uwANMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKisgRDH4IBjsAoJCpLMPQhGOAIjEKi+gdczqPQcNTxwAAAAABJRU5ErkJggg=="
          objectFit="contain"
          fill={true}
          src={src}
        />
      </div>
    );
  } else {
    return (
      <div className="relative h-16">
        <Image alt="product image" src={"https://placehold.co/120x70/png"} height={120} width={70} />
      </div>
    );
  }
}

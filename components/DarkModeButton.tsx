"use client"

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
type Props = {}

const DarkModeButton = (props: Props) => {
    const { setTheme } = useTheme();

    return (
        <div>
            <Button
                variant="outline"
                size="icon"
                className="ml-[5px]"
            >
                <SunIcon
                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black"
                    onClick={() => setTheme("dark")}
                />
                <MoonIcon
                    className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white"
                    onClick={() => setTheme("light")}
                />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    )
}

export default DarkModeButton
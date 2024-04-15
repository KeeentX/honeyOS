import {Montserrat, Roboto} from "next/font/google";

const montserrat = Montserrat({
    weight: "700",
    subsets: ["latin"],
});

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
});
export default function useFont() {
    return {
        montserrat, roboto
    }
}
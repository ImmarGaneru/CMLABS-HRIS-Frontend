import {redirect} from "next/navigation";

export default function ManagerPage() {
    redirect("/manager/dashboard");
    return null; // This line is never reached, but it's good practice to return something
}
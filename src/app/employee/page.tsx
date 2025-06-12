import {redirect} from "next/navigation";

export default function EmployeePage() {
    redirect("/employee/dashboard");
    return null; // This line is never reached, but it's good practice to return something
}
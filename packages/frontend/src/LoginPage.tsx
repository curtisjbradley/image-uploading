import React, {useActionState} from "react";
import "./LoginPage.css";
import {Link, useNavigate} from "react-router";
import {ValidRoutes} from "csc437-monorepo-backend/src/shared/ValidRoutes.ts"

interface ILoginProps {
    isRegistering: boolean
    setToken: React.Dispatch<string>
}

export function LoginPage(props: Readonly<ILoginProps>){
    const navigate = useNavigate()
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();

    function getErrorMessage(status: number) {
        switch (status) {
            case 0:
                return ""
            case 400:
                return "Could not send password and username"
            case 401:
                return "Invalid Credentials"
            case 409:
                return "User already exists"
            case 500:
                return "Ran into an error"
            default:
                return "Successful"
        }
    }

    const [result, submitAction, isPending] = useActionState(
        async (previousState: number,formData: FormData) => {
            if(previousState === 201){
                return 201
            }
            const username = formData.get("username");
            const password = formData.get("password");

            const res =  await fetch(`auth/${props.isRegistering ? "register" : "login"}`, {method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username,password})})

            if(res.ok) {
                await res.json().then(body => props.setToken(body.token))
                navigate("/")
            }
            return res.status
        },
        0
    );

    return (
        <div>
            {props.isRegistering ? (<h2>Register</h2>) : (<h2>Login</h2>)}
            <form className="LoginPage-form" action={submitAction}>
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} name={"username"} required disabled={isPending} />

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} type="password" name={"password"} required disabled={isPending} />
                <input type="submit" value="Submit" disabled={isPending} />
                {result != 201 && <p aria-live={"polite"} style={{color: "red"}}>{getErrorMessage(result)}</p> }
            </form>
            {!props.isRegistering && <div>
                <p>Don't have an account?</p>
                <p>Register <Link to={ValidRoutes.REGISTER}>here</Link></p>
            </div>}
        </div>
    );
}

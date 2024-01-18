import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
    return (
        <div className="w-full flex justify-center">
            <SignIn />
        </div>
    )
}

export default SignInPage
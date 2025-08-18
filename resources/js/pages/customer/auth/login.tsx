import { Head, useForm } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { FormEvent } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function CustomerLoginPage() {
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('customer.login'));
    };

    return (
        <>
            <Head title="Login as a Customer" />
            <div className="relative container mx-auto grid min-h-dvh place-items-center p-4">
                <div className="grid max-w-2xl grid-cols-1 gap-4 rounded-lg border border-gray-200 p-6 shadow-md">
                    <div>
                        <h1>Customer Login</h1>
                        <p>Please fill out the form to login as a customer.</p>
                    </div>
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="col-span-2" htmlFor="email">
                                <span className="mb-2">Email</span>
                                <input
                                    id="email"
                                    autoComplete="email"
                                    className="my-1.5 w-full rounded border border-neutral-200 p-2"
                                    type="email"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </label>
                            {errors.email && <div className="col-span-2 text-red-500">{errors.email}</div>}
                            <label className="col-span-2" htmlFor="password">
                                <span>Password</span>
                                <input
                                    className="my-1.5 w-full rounded border border-neutral-200 p-2"
                                    type="password"
                                    placeholder="Password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </label>
                            {errors.password && <div className="col-span-2 text-red-500">{errors.password}</div>}

                            <label htmlFor="remember" className="col-span-1 grid grid-cols-[auto_1fr] items-center gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            {errors.remember && <div className="col-span-2 text-red-500">{errors.remember}</div>}

                            <button className="col-span-2 my-2 h-9 rounded bg-neutral-100 shadow" disabled={processing} type="submit">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CustomerLoginPage as any).layout = (page: React.ReactNode) => <SiteLayout>{page}</SiteLayout>;

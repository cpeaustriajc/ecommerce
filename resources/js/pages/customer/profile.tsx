import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SiteLayout from '@/layouts/site-layout';
import { Customer } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, AtSignIcon, SaveIcon } from 'lucide-react';

export default function CustomerProfilePage({ customer }: { customer?: Customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer?.name ?? 'Guest',
        email: customer?.email ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('customer.profile.update', customer?.id), {
            preserveScroll: true,
        });
    };
    return (
        <>
            <Head title="Customer Profile" />
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('storefront.index')}>
                                <ArrowLeftIcon className="mr-2 size-4" />
                                Back to Storefront
                            </Link>
                        </Button>
                    </div>
                    <h1 className="mb-8 text-3xl font-bold">Customer Profile</h1>
                    <form onSubmit={submit} noValidate>
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="*:not-first:mt-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            type="text"
                                            autoComplete="name"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="*:not-first:mt-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Input
                                                className="peer ps-9"
                                                autoComplete="email"
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                aria-invalid={errors.email ? 'true' : 'false'}
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 start-0 flex h-9 items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50 peer-aria-invalid:text-destructive">
                                                <AtSignIcon size={16} aria-hidden="true" />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-2 text-xs peer-aria-invalid:text-destructive" role="alert" aria-live="polite">
                                                    Email is invalid
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={processing} type="submit">
                                    <SaveIcon className="mr-2 size-4" />
                                    {processing ? 'Processing...' : 'Update Profile'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CustomerProfilePage as any).layout = (page: React.ReactNode) => <SiteLayout>{page}</SiteLayout>;

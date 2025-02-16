import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import { useGetProfileMutation, useUpdateProfileMutation } from "@/slices/userApiSlice";
import { toast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/slices/authSlice";

const userSchemaUpdateValidate = z.object({
    firstName: z.string({ required_error: "First Name is required" }),
    lastName: z.string().optional(),
    phoneNumber: z
        .string({ required_error: "Mobile Number is required" })
        .regex(/^[6-9]\d{9}$/, { message: "Invalid Mobile Number." }),
    email: z
        .string({ required_error: "Email is required" })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid Email Address." }),
});

export const ProfilePage = () => {
    const dispatch = useDispatch();
    const [getProfile, { isLoading: isFetching }] = useGetProfileMutation();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        resolver: zodResolver(userSchemaUpdateValidate),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
        },
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getProfile().unwrap();
                form.reset(res.user);
            } catch (error) {
                toast({
                    title: "Failed to load profile",
                    description: error?.data?.message || "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        }

        fetchProfile();
    }, [getProfile, form]);

    async function onSubmit(data) {
        try {
            const res = await updateProfile(data).unwrap();
            if (res.success) {
                toast({
                    title: "Profile Updated Successfully",
                });
                dispatch(setCredentials({ user: res.user, token: res.token }));
                setIsEditing(false);
                form.reset(res.user);
            } else {
                toast({
                    title: "Update Failed",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Update Failed",
                description: error?.data?.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-full bg-gray-100">
            {isFetching ? (
                <div className="flex justify-center">
                    <Loader2 className="animate-spin text-gray-600" size={40} />
                </div>
            ) : (
                <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-6">Your Profile</h1>
                    </div>

                    <div className="flex justify-end mb-4">
                        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </Button>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="First Name" {...field} disabled={!isEditing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Last Name" {...field} disabled={!isEditing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mobile Number</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="Mobile Number" {...field} disabled={!isEditing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Email" {...field} disabled={!isEditing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {isEditing && (
                                <div className="flex justify-center">
                                    <Button className="w-full" type="submit" disabled={isUpdating}>
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" />Updating...
                                            </>
                                        ) : (
                                            <>Update Profile</>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            )}
            <div />
        </div>
    );
};

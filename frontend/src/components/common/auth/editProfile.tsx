import { RootState } from "@/types/common";
import { message } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { getSignedUrlApi, getUploadUrlApi, updateProfileApi } from "@/services/common/post.services";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { setUser } from "@/redux/slices/user.slice";
import { useEffect } from "react";
import { memo } from "react";

const ProfileContents = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const [profilePicture, setProfilePicture] = useState<File | null>(null)
    const [userData, setUserData] = useState({
        tenant_id: user.user_id,
        main_id: user.main_id,
        name: user.name,
        email: user.email,
        bio: user?.bio || "bio",
        profile: user.profile || "",
    })


    useEffect(() => {
        setUserData({
            tenant_id: user.user_id,
            main_id: user.main_id,
            name: user.name || '',
            email: user.email || '',
            bio: user?.bio || '',
            profile: user.profile || '',
        });

        const loadProfileImage = async () => {
            try {
                if (userData.profile && userData.profile !== "") {
                    setIsProfileLoading(true)
                    const signedUrlRes = await getSignedUrlApi(user.profile as string)

                    if (signedUrlRes.data && signedUrlRes.data.signedUrl) {
                        setUserData((prev) => ({
                            ...prev,
                            profile: signedUrlRes.data.signedUrl
                        }));
                        setIsProfileLoading(false)

                    }
                }
            } catch (error) {
                setIsProfileLoading(false)
                console.error("Error loading profile image:", error);
            }
        };

        loadProfileImage();
    }, [user]);



    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                message.error("Only image files (jpeg, png, jpg, gif) are supported");
                return;
            }
            setIsProfileLoading(true)

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(file);
                setProfileImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            setIsProfileLoading(false)

        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }








    const handleSave = async () => {
        try {
            if (userData.name.trim() == "" || userData.bio.trim() == "") {
                toast.warning("Please fill the inputs accordingly.")
                return
            }
            setIsLoading(true);
            const role = user.role === "agency" ? user.role : "client";
            let profileKey = user.profile;

            if (profilePicture) {
                const fileData = {
                    fileName: profilePicture.name,
                    fileType: profilePicture.type,
                    fileSize: profilePicture.size
                };

                const response = await getUploadUrlApi(fileData);

                await axios.put(response?.data?.s3file.url, profilePicture, {
                    headers: {
                        'Content-Type': response?.data?.s3file.contentType,
                        'Content-Disposition': 'inline',
                    },
                });

                profileKey = response?.data?.s3file?.key || "";
            }

            const updatedUserData = {
                ...userData,
                profile: profileKey
            };

            const updateResponse = await updateProfileApi(role, updatedUserData);

            if (updateResponse) {
                toast.success("Profile successfully updated.")

                const updatedUser = {
                    name: updateResponse.data.details.name,
                    bio: updateResponse.data.details.bio,
                    profile: updateResponse.data.details.profile,
                };
                dispatch(setUser({ name: updatedUser.name, bio: updatedUser.bio, profile: updatedUser.profile }));

                setIsEditing(false);
                setProfilePicture(null);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.")
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Card className="overflow-hidden">
            <div className="relative px-6">
                <div className="flex  justify-between items-end">
                    {isEditing ? (
                        isProfileLoading ? (
                            <>
                                <Skeleton height={90} className='mt-6' width={90} borderRadius={50} />

                            </>
                        ) : (
                            <div className="relative group">
                                <Avatar className="h-24 w-24 mt-6 border-4 border-background">
                                    <AvatarImage src={
                                        profileImageUrl
                                            ? profileImageUrl
                                            : (userData.profile || '')
                                    }
                                        className="h-full w-full object-cover"
                                        alt={userData.name} />
                                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 mt-6 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <label htmlFor="avatar-upload" className="cursor-pointer">
                                        <Camera className="h-8 w-8 text-white" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        )
                    ) : (
                        isProfileLoading ? (
                            <>
                                <Skeleton height={90} className='mt-6' width={90} borderRadius={50} />
                            </>
                        ) : (
                            <Avatar className="h-24 w-24 mt-6 border-4 border-background overflow-hidden rounded-full">
                                <AvatarImage
                                    src={userData.profile || ''}
                                    alt={userData.name}
                                    className="h-full w-full object-cover"
                                />
                                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                            </Avatar>


                        )

                    )
                    }
                    <div className="ml-auto absolute top-4 right-6">
                        {
                            isLoading ? (
                                <>
                                    <Skeleton height={32} className='mr-2 h-4 w-4' width={74} />
                                </>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                                    {isEditing ? (

                                        <>
                                            <Save className="mr-2 h-4 w-4" /> Save
                                        </>

                                    ) : (
                                        <>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </>
                                    )}
                                </Button>
                            )
                        }

                    </div>
                </div>
            </div>

            <CardContent className="pt-6 space-y-6">
                {isEditing ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={userData.name} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" value={userData.bio} onChange={handleChange} rows={3} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">{userData.name}</h2>
                            <p className="text-muted-foreground">{userData.email}</p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2">About</h3>
                            <p className="text-sm text-muted-foreground">{userData.bio}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Joined</h3>
                                <p className="text-sm text-muted-foreground">March 2023</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium mb-2">Role</h3>
                                <p className="text-sm text-muted-foreground">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default memo(ProfileContents);

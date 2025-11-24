'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface SplashScreen {
    _id: string;
    title: string;
    mediaUrl: string;
    mediaType: 'image' | 'gif' | 'video';
    duration: number;
    backgroundColor: string;
    createdAt: string;
    updatedAt: string;
}

export function SplashScreenSection() {
    const [splashScreen, setSplashScreen] = useState<SplashScreen | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        mediaUrl: '',
        mediaType: 'image' as 'image' | 'gif' | 'video',
        duration: 5,
        backgroundColor: '#ffffff',
    });

    useEffect(() => {
        fetchSplashScreen();
    }, []);

    const fetchSplashScreen = async () => {
        try {
            const res = await fetch('/api/splash-screen');
            if (res.ok) {
                const data = await res.json();
                setSplashScreen(data);
                if (data) {
                    setFormData({
                        title: data.title,
                        mediaUrl: data.mediaUrl,
                        mediaType: data.mediaType,
                        duration: data.duration,
                        backgroundColor: data.backgroundColor,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching splash screen:', error);
            toast.error('Failed to load splash screen');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/splash-screen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setSplashScreen(data);
                setIsDialogOpen(false);
                toast.success('Splash screen updated successfully');
            } else {
                toast.error('Failed to update splash screen');
            }
        } catch (error) {
            console.error('Error updating splash screen:', error);
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Splash Screen</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Spinner />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Splash Screen</CardTitle>
                <CardDescription>Manage your mobile app splash screen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {splashScreen ? (
                    <div className="space-y-4">
                        <div
                            className="rounded-lg border overflow-hidden"
                            style={{ backgroundColor: splashScreen.backgroundColor }}
                        >
                            {splashScreen.mediaType === 'video' ? (
                                <video
                                    src={splashScreen.mediaUrl}
                                    className="w-full h-64 object-cover"
                                    controls
                                />
                            ) : (
                                <img
                                    src={splashScreen.mediaUrl || '/placeholder.svg'}
                                    alt="Splash Screen"
                                    className="w-full h-64 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{splashScreen.title}</h3>
                                {/* <p className="text-sm text-muted-foreground mt-2">
                                    {splashScreen.description}
                                </p> */}
                                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                                    <span className="capitalize">Type: {splashScreen.mediaType}</span>
                                    <span>Duration: {splashScreen.duration}s</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(splashScreen.updatedAt).toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-muted-foreground">No splash screen configured yet</p>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">
                            {splashScreen ? 'Update Splash Screen' : 'Create Splash Screen'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {splashScreen ? 'Update' : 'Create'} Splash Screen
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <Label htmlFor="mediaType">Media Type</Label>
                                <select
                                    id="mediaType"
                                    value={formData.mediaType}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            mediaType: e.target.value as 'image' | 'gif' | 'video',
                                        })
                                    }
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="image">Image</option>
                                    <option value="gif">GIF</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="mediaUrl">Media URL</Label>
                                <Input
                                    id="mediaUrl"
                                    type="url"
                                    value={formData.mediaUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, mediaUrl: e.target.value })
                                    }
                                    placeholder={`e.g., https://example.com/splash.${formData.mediaType === 'video' ? 'mp4' : formData.mediaType === 'gif' ? 'gif' : 'png'
                                        }`}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <Label htmlFor="duration">Display Duration (seconds)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    value={formData.duration}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            duration: parseInt(e.target.value) || 5,
                                        })
                                    }
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    How many seconds to show the splash screen
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="backgroundColor">Background Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="backgroundColor"
                                        type="text"
                                        value={formData.backgroundColor}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                backgroundColor: e.target.value,
                                            })
                                        }
                                        disabled={isSubmitting}
                                    />
                                    <input
                                        type="color"
                                        value={formData.backgroundColor}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                backgroundColor: e.target.value,
                                            })
                                        }
                                        disabled={isSubmitting}
                                        className="w-12 h-10 rounded border cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

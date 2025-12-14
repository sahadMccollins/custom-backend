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
import { Trash2, Plus } from 'lucide-react';

interface Banner {
    _id: string;
    title: string;
    imageUrl: string;
    description?: string;
    link?: string;
    section: 'top' | 'section-1' | 'section-2' | 'section-3';
    template: string;
    collectionTitle: string,
    collectionImage: string,
    collectionBg: string,
    order: number;
    createdAt: string;
    updatedAt: string;
}

type BannerSection = 'top' | 'section-1' | 'section-2' | 'section-3';

const SECTION_LABELS: Record<BannerSection, string> = {
    'top': 'Top Section',
    'section-1': 'Section 1',
    'section-2': 'Section 2',
    'section-3': 'Section 3',
};

export function BannersSection() {
    const [banners, setBanners] = useState<Record<BannerSection, Banner[]>>({
        'top': [],
        'section-1': [],
        'section-2': [],
        'section-3': [],
    });
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentSection, setCurrentSection] = useState<BannerSection>('top');

    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        link: '',
        section: 'top' as BannerSection,
        order: 0,
        template: '',
        collectionTitle: '',
        collectionImage: '',
        collectionBg: "#f7ed57",
    });

    useEffect(() => {
        fetchAllBanners();
    }, []);

    const fetchAllBanners = async () => {
        try {
            setLoading(true);
            const sections: BannerSection[] = ['top', 'section-1', 'section-2', 'section-3'];
            const bannersBySection: Record<BannerSection, Banner[]> = {
                'top': [],
                'section-1': [],
                'section-2': [],
                'section-3': [],
            };

            for (const section of sections) {
                const res = await fetch(`/api/banners?section=${section}`);
                if (res.ok) {
                    const data = await res.json();
                    bannersBySection[section] = data;
                }
            }

            setBanners(bannersBySection);
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error('Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            imageUrl: '',
            link: '',
            section: currentSection,
            order: 0,
            template: '',
            collectionTitle: '',
            collectionImage: '',
            collectionBg: "#f7ed57",
        });
        setEditingId(null);
    };

    const openCreateDialog = (section: BannerSection) => {
        setCurrentSection(section);
        setFormData({
            title: '',
            imageUrl: '',
            link: '',
            section,
            order: 0,
            template: 'template1',
            collectionTitle: '',
            collectionImage: '',
            collectionBg: "#f7ed57",
        });
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (banner: Banner) => {
        setCurrentSection(banner.section);
        setFormData({
            title: banner.title,
            imageUrl: banner.imageUrl,
            link: banner.link || '',
            section: banner.section,
            order: banner.order,
            template: banner.template,
            collectionTitle: banner.collectionTitle,
            collectionImage: banner.collectionImage,
            collectionBg: banner.collectionBg,
        });
        setEditingId(banner._id);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingId) {
                const res = await fetch(`/api/banners/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    toast.success('Banner updated successfully');
                    fetchAllBanners();
                    setIsDialogOpen(false);
                } else {
                    toast.error('Failed to update banner');
                }
            } else {
                const res = await fetch('/api/banners', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    toast.success('Banner created successfully');
                    fetchAllBanners();
                    setIsDialogOpen(false);
                } else {
                    toast.error('Failed to create banner');
                }
            }
        } catch (error) {
            console.error('Error submitting banner:', error);
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;


        console.log("id he", id);
        try {
            const res = await fetch(`/api/banners/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Banner deleted successfully');
                fetchAllBanners();
            } else {
                toast.error('Failed to delete banner');
            }
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('An error occurred');
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Banners</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Spinner />
                </CardContent>
            </Card>
        );
    }

    const sections: BannerSection[] = ['top', 'section-1', 'section-2', 'section-3'];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Banners</CardTitle>
                <CardDescription>
                    Manage banners across 4 different sections
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {sections.map((section) => (
                    <div key={section} className="space-y-4 pb-6 border-b last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{SECTION_LABELS[section]}</h3>
                            <Dialog open={isDialogOpen && currentSection === section} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={() => openCreateDialog(section)}
                                        className="gap-2"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Banner
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingId ? 'Edit' : 'Add New'} Banner - {SECTION_LABELS[section]}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="banner-title">Title</Label>
                                            <Input
                                                id="banner-title"
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, title: e.target.value })
                                                }
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="banner-imageUrl">Image URL</Label>
                                            <Input
                                                id="banner-imageUrl"
                                                type="url"
                                                value={formData.imageUrl}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, imageUrl: e.target.value })
                                                }
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="banner-link">Id (optional)</Label>
                                            <Input
                                                id="banner-link"
                                                type="url"
                                                value={formData.link}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, link: e.target.value })
                                                }
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="banner-template">Collection Template</Label>
                                            <select
                                                id="banner-template"
                                                value={formData.template}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, template: e.target.value })
                                                }
                                                disabled={isSubmitting}
                                                className="border rounded-md p-2 w-full"
                                            >
                                                <option value="">Select Template</option>
                                                <option value="template1">Template 1</option>
                                                <option value="template2">Template 2</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="banner-collection-title">Collection Title</Label>
                                            <Input
                                                id="banner-collection-title"
                                                type="text"
                                                value={formData.collectionTitle}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, collectionTitle: e.target.value })
                                                }
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="banner-collection-image">Collection Image</Label>
                                            <Input
                                                id="banner-collection-image"
                                                type="text"
                                                value={formData.collectionImage}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, collectionImage: e.target.value })
                                                }
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="banner-collection-bg">Collection Background Color</Label>
                                            <Input
                                                id="banner-collection-bg"
                                                type="text"
                                                value={formData.collectionBg}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, collectionBg: e.target.value })
                                                }
                                                disabled={isSubmitting}
                                            />
                                        </div>


                                        <div>
                                            <Label htmlFor="banner-order">Display Order</Label>
                                            <Input
                                                id="banner-order"
                                                type="number"
                                                value={formData.order}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        order: parseInt(e.target.value),
                                                    })
                                                }
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="flex gap-2 justify-end pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsDialogOpen(false);
                                                    resetForm();
                                                }}
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
                        </div>

                        {banners[section].length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">
                                No banners in this section yet.
                            </p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {banners[section].map((banner) => (
                                    <div
                                        key={banner._id}
                                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <img
                                            src={banner.imageUrl || "/placeholder.svg"}
                                            alt={banner.title}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-3 space-y-2">
                                            {/* <div>
                                                <h4 className="font-semibold text-sm line-clamp-2">
                                                    {banner.title}
                                                </h4>
                                                {banner.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {banner.description}
                                                    </p>
                                                )}
                                            </div> */}
                                            <p className="text-xs text-muted-foreground">
                                                Order: {banner.order}
                                            </p>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(banner)}
                                                    className="flex-1"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(banner._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" /> 
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

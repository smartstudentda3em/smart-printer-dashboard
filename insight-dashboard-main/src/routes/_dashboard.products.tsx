import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";

import {
  ApiError,
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type Product,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_dashboard/products")({
  component: ProductsPage,
});

type FormState = {
  title: string;
  description: string;
  price: string;
  is_featured: boolean;
  image: File | null;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  price: "",
  is_featured: false,
  image: null,
};

function ProductsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page],
    queryFn: () => listProducts(page),
  });

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function openCreate() {
    setForm(emptyForm);
    setFieldErrors({});
    setCreating(true);
  }

  function openEdit(p: Product) {
    setForm({
      title: p.title,
      description: p.description,
      price: String(p.price),
      is_featured: p.is_featured,
      image: null,
    });
    setFieldErrors({});
    setEditing(p);
  }

  function closeDialog() {
    setCreating(false);
    setEditing(null);
  }

  const saveMutation = useMutation({
    retry: false,
    mutationFn: async (payload: { id?: number; form: FormState }) => {
      const fd = new FormData();
      fd.append("title", payload.form.title);
      fd.append("description", payload.form.description);
      fd.append("price", payload.form.price.trim() === "" ? "0" : payload.form.price);
      fd.append("is_featured", payload.form.is_featured ? "1" : "0");
      if (payload.form.image) fd.append("image", payload.form.image);
      return payload.id ? updateProduct(payload.id, fd) : createProduct(fd);
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    },
    onError: (err) => {
      // Only surface validation errors inline; never show a generic "try again" toast.
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      }
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (res) => {
      toast.success(res.message || "Deleted");
      qc.invalidateQueries({ queryKey: ["products"] });
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete");
      setDeletingId(null);
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors: Record<string, string[]> = {};
    if (!form.title.trim()) errors.title = ["Title is required."];
    if (!form.description.trim()) errors.description = ["Description is required."];
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    saveMutation.mutate({ id: editing?.id, form });
  }

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New product
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
            Loading products…
          </div>
        ) : error ? (
          <p className="p-8 text-sm text-destructive">Failed to load products.</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No products yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-28">Price</TableHead>
                <TableHead className="w-28">Featured</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="h-10 w-10 rounded object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{p.title}</div>
                    <div className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                      {p.description}
                    </div>
                  </TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>
                    {p.is_featured ? (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" /> Yes
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingId(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page} · {pagination.total} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={creating || editing !== null} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update product details." : "Add a new product to your catalog."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              {fieldErrors.title?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.title[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              {fieldErrors.description?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.description[0]}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
                {fieldErrors.price?.[0] && (
                  <p className="text-xs text-destructive">{fieldErrors.price[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Featured</Label>
                <div className="flex h-9 items-center gap-2">
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))}
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.is_featured ? "Featured" : "Not featured"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">
                Image {editing && <span className="text-xs text-muted-foreground">(leave empty to keep)</span>}
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.files?.[0] ?? null }))
                }
              />
              {fieldErrors.image?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.image[0]}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

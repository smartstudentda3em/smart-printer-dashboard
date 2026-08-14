import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { ApiError, getSettings, updateSettings, type Settings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings().then((r) => r.data),
  });

  const [form, setForm] = useState<Settings>({
    paper_price: 0,
    delivery_price: 0,
    whatsapp_number: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Settings) => updateSettings(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Saved");
      setFieldErrors({});
      qc.setQueryData(["settings"], res.data);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        if (err.errors) setFieldErrors(err.errors);
        toast.error(err.message);
      } else {
        toast.error("Failed to update settings");
      }
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({
      paper_price: Number(form.paper_price),
      delivery_price: Number(form.delivery_price),
      whatsapp_number: form.whatsapp_number,
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Pricing and contact information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>These values are shown to customers.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">Failed to load settings.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paper_price">Paper price</Label>
                  <Input
                    id="paper_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.paper_price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, paper_price: Number(e.target.value) }))
                    }
                  />
                  {fieldErrors.paper_price?.[0] && (
                    <p className="text-xs text-destructive">{fieldErrors.paper_price[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_price">Delivery price</Label>
                  <Input
                    id="delivery_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.delivery_price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, delivery_price: Number(e.target.value) }))
                    }
                  />
                  {fieldErrors.delivery_price?.[0] && (
                    <p className="text-xs text-destructive">{fieldErrors.delivery_price[0]}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp number</Label>
                <Input
                  id="whatsapp_number"
                  type="tel"
                  placeholder="+201234567890"
                  value={form.whatsapp_number}
                  onChange={(e) => setForm((f) => ({ ...f, whatsapp_number: e.target.value }))}
                />
                {fieldErrors.whatsapp_number?.[0] && (
                  <p className="text-xs text-destructive">{fieldErrors.whatsapp_number[0]}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

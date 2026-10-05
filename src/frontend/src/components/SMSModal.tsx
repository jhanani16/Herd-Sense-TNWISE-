import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Alert } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { loadFarmerProfile } from "../utils/farmerProfile";
import type { Lang } from "../utils/translations";
import { t } from "../utils/translations";

interface SMSModalProps {
  open: boolean;
  onClose: () => void;
  alert: Alert | null;
  tamilMessage: string;
  lang: Lang;
  onSend: () => void;
}

export function SMSModal({
  open,
  onClose,
  alert,
  tamilMessage,
  lang,
  onSend,
}: SMSModalProps) {
  const { actor, isFetching } = useActor();
  const [isSending, setIsSending] = useState(false);

  if (!alert) return null;

  const rawPhone = loadFarmerProfile().phone || "+91-98765-43210";
  // Strip non-digit characters for the API call, convert leading 0 → 91
  const cleanPhone = rawPhone.replace(/[\s+\-()]/g, "").replace(/^0/, "91");

  const englishMessage = alert.message;
  const displayMessage = lang === "ta" ? tamilMessage : englishMessage;

  const handleSend = async () => {
    if (!actor || isFetching) {
      toast.error(t("gatewayError", lang), {
        description:
          lang === "ta"
            ? "நடிகர் தயாராக இல்லை. மீண்டும் முயற்சிக்கவும்."
            : "Actor not ready. Please try again.",
      });
      return;
    }

    setIsSending(true);
    try {
      const result: string = await (actor as any).sendSms(
        cleanPhone,
        displayMessage,
      );

      if (result.startsWith("Error:")) {
        toast.error(t("gatewayError", lang), {
          description: result,
          duration: 5000,
        });
      } else {
        onSend();
        onClose();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(t("gatewayError", lang), {
        description: msg,
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isSending) onClose();
      }}
    >
      <DialogContent className="max-w-md" data-ocid="sms.modal.dialog">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {t("smsModalTitle", lang)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("smsPhone", lang)}
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span className="font-mono text-sm font-semibold">
                {rawPhone}
              </span>
            </div>
          </div>

          {/* Alert ID */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">Animal: {alert.animal_id}</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                alert.severity === "critical"
                  ? "bg-alert-bg text-alert-fg"
                  : "bg-monitor-bg text-monitor-fg"
              }`}
            >
              {alert.severity}
            </span>
          </div>

          {/* Message preview */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("smsMessage", lang)}
            </Label>
            <Textarea
              value={displayMessage}
              readOnly
              rows={5}
              className="text-sm resize-none bg-muted/30 font-medium leading-relaxed"
              data-ocid="sms.modal.textarea"
            />
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground italic">
            {t("smsSimulatedNote", lang)}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSending}
            data-ocid="sms.modal.close.button"
            className="gap-1"
          >
            {t("smsClose", lang)}
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !actor || isFetching}
            data-ocid="sms.modal.send.button"
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSending ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  data-ocid="sms.modal.sending.loading_state"
                />
                {t("smsSending", lang)}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("smsSendButton", lang)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

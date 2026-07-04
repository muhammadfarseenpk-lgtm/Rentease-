import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, AlertTriangle, Wrench, CheckCircle, Eye, Camera, Image as ImageIcon, ClipboardX } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatusBadge } from "./AdminOverview";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/hooks/useApp";

export default function AdminClaims() {
  const [claimSearch, setClaimSearch] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  
  const { claims, orders, products, resolveClaim } = useApp();

  const displayClaims = claims.map(claim => {
    const order = orders.find(o => o.id === claim.orderRef);
    const product = products.find(p => p.id === order?.productId)?.name || "Unknown";
    return {
      ...claim,
      product,
      date: order?.createdAt || "Unknown",
    };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Open Claims" value="1" color="bg-red-50 text-red-600" />
        <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Under Review" value="1" color="bg-amber-50 text-amber-600" />
        <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Resolved" value="1" color="bg-green-50 text-green-600" />
      </div>

      <Card className="rounded-[1.5rem] border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Disputes & Claims</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by customer or ID..." 
              value={claimSearch}
              onChange={(e) => setClaimSearch(e.target.value)}
              className="pl-9 w-full sm:w-64 rounded-xl border-gray-200"
            />
          </div>
        </div>
        
        {displayClaims.filter(c => c.customer.toLowerCase().includes(claimSearch.toLowerCase()) || c.id.toLowerCase().includes(claimSearch.toLowerCase())).length === 0 ? (
          <div className="p-6">
            <EmptyState 
              icon={<ClipboardX className="w-8 h-8" />} 
              title="No claims found" 
              message={claimSearch ? `No claims match your search "${claimSearch}"` : "There are currently no disputes or claims in the system."} 
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayClaims.filter(c => c.customer.toLowerCase().includes(claimSearch.toLowerCase()) || c.id.toLowerCase().includes(claimSearch.toLowerCase())).map((claim) => (
              <div key={claim.id} className="px-6 py-5 hover:bg-gray-50/40 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${claim.type === 'Damage' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    {claim.type === 'Damage' ? <Wrench className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900">{claim.id}</span>
                      <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 uppercase tracking-wider">{claim.type}</span>
                      <StatusBadge label={claim.status} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">{claim.customer}</span>
                      <span className="text-gray-500 mx-2">•</span>
                      <span className="text-gray-600">{claim.product}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {claim.orderRef} • {claim.date}
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 mt-2">
                      {claim.notes}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    className="rounded-full h-9 px-4 font-bold border-brand text-brand hover:bg-orange-50 w-full md:w-auto"
                    onClick={() => { setSelectedClaim(claim); setReviewOpen(true); }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {claim.status === 'Resolved' ? 'View Details' : 'Review Claim'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-xl rounded-[2rem] p-8 bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Review Claim <span className="text-sm font-mono text-gray-500 ml-2">{selectedClaim?.id}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</span>
                  <p className="font-bold text-gray-900">{selectedClaim.customer}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product</span>
                  <p className="font-bold text-gray-900">{selectedClaim.product}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-brand" /> Claim Details
                </h4>
                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl text-sm text-gray-800">
                  <p className="font-bold text-orange-800 mb-1">Issue Reported:</p>
                  {selectedClaim.notes}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-500" /> Evidence
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">Photo 1</span>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">Photo 2</span>
                  </div>
                </div>
              </div>

              {selectedClaim.status !== 'Resolved' ? (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900">Resolution Log</h4>
                  <Textarea 
                    placeholder="Enter notes on how this claim is being resolved..." 
                    className="rounded-xl border-gray-200 resize-none h-24"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                  />
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold"
                      onClick={() => {
                        toast.error(`Claim ${selectedClaim.id} rejected`);
                        setReviewOpen(false);
                      }}
                    >
                      Reject Claim
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold"
                      onClick={() => {
                        resolveClaim(selectedClaim.id);
                        toast.success(`Claim ${selectedClaim.id} resolved`);
                        setReviewOpen(false);
                      }}
                    >
                      Approve & Resolve
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Claim Resolved
                  </h4>
                  <p className="text-sm text-green-700">This claim has already been resolved. No further action is required.</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

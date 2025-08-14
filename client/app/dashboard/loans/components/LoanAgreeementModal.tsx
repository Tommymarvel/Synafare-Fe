'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';

type Props = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void; // continue / I Accept
};

export default function LoanAgreementModal({ open, onClose, onAccept }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [signing, setSigning] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  // lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // focus panel
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  async function acceptAgreement() {
    try {
      setSigning(true);
      await axiosInstance.post('/loan/agreement', {
        action: 'signed',
      });
      onAccept();

      router.push('/dashboard/loans/request/');
      await refreshUser();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        (axiosError.response && axiosError.response.data
          ? axiosError.response.data.message || axiosError.response.data
          : axiosError.message || 'An error occurred'
        ).toString()
      );
    } finally {
      setSigning(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loan-agreement-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex  lg:items-center justify-center px-4 py-6 lg:px-8 lg:py-12">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="w-full max-w-[960px] bg-white rounded-2xl shadow-2xl outline-none flex flex-col"
        >
          {/* header */}
          <div className="relative px-5 py-4 lg:px-8 lg:py-6">
            <h2
              id="loan-agreement-title"
              className="text-xl lg:text-2xl font-semibold text-raisin text-left"
            >
              Loan Agreement
            </h2>{' '}
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mt-4 border-t lg:mt-6" />
          </div>

          {/* body (scrollable) */}
          <div className="px-5 lg:px-8 pb-4 lg:pb-6 overflow-y-auto grow max-h-[calc(100vh)] lg:max-h-[60vh]">
            <div className="space-y-4 text-sm leading-6 text-raisin">
              {/* Replace with real copy */}
              {Array.from({ length: 18 }).map((_, i) => (
                <p key={i}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                  maxime ullam facere, inventore provident laboriosam ex
                  reiciendis aspernatur ratione officia accusamus. Ab nulla esse
                  voluptatibus quos sapiente, beatae repellat corporis numquam
                  nobis tempore tempora ducimus reprehenderit praesentium itaque
                  aspernatur perferendis. Excepturi veritatis cupiditate, sit
                  adipisci voluptate soluta enim, cum ipsum fuga, odit sint
                  velit perspiciatis! Veritatis eum omnis sunt earum debitis
                  illum, magni explicabo voluptatum error ratione sint rem,
                  doloribus dolorem, natus odio! Consequuntur quisquam
                  accusantium vel recusandae voluptas a aperiam totam neque
                  officia tenetur, facilis quia nobis asperiores quam sed
                  necessitatibus fuga error rerum autem dolorum in dolore
                  voluptate! Similique eligendi eum adipisci sapiente reiciendis
                  natus officiis reprehenderit dolorem! Laudantium quod
                  assumenda vel voluptatem recusandae reprehenderit culpa iste
                  suscipit id cupiditate, inventore, debitis facilis deserunt ut
                  aspernatur facere a vitae incidunt eaque exercitationem dicta
                  veritatis. Alias ipsa aliquam fugiat unde, repudiandae minima
                  quaerat similique quos incidunt doloribus beatae, quia
                  possimus et assumenda officiis nam, modi culpa ea vel
                  consequatur blanditiis ipsam! Iure voluptatem at amet dolore
                  facilis saepe veniam praesentium aspernatur dolorum dolor
                  perspiciatis repellat error laborum quos incidunt cupiditate
                  deleniti, repudiandae fugiat. Ut odio esse molestiae
                  consequuntur, deserunt perspiciatis illo itaque adipisci
                  veritatis ea necessitatibus pariatur! Nesciunt sint dolores
                  dolor. Iusto, deleniti blanditiis! Sed expedita nemo atque
                  reprehenderit maiores quibusdam cumque magnam voluptate vero
                  laborum, nesciunt ab consequuntur quo nam vitae autem delectus
                  fugit. Molestiae magnam quibusdam explicabo aliquid delectus
                  beatae optio? Assumenda voluptas illo quos libero hic.
                  Architecto totam quam qui rem fugiat impedit temporibus unde,
                  natus aut dolores! Sequi, aliquid, animi, beatae alias
                  expedita rerum tempore veritatis debitis quas exercitationem
                  nemo voluptas tempora commodi ducimus amet quis quasi numquam
                  excepturi? Laboriosam et maiores corrupti debitis, possimus
                  doloribus deleniti blanditiis corporis ipsam temporibus!
                  Perferendis fuga iure rerum vel esse, perspiciatis,
                  praesentium numquam qui eligendi aperiam quod accusantium ex
                  vitae quisquam doloremque non nobis quos doloribus,
                  repudiandae tempore officia asperiores? Commodi officiis, cum
                  et adipisci animi nemo tempore fugit excepturi quas qui
                  praesentium maiores soluta perferendis pariatur amet aut nihil
                  quidem omnis perspiciatis ducimus dolores? Id debitis,
                  nesciunt dolore facilis dolorem quo iste vitae, fuga dicta
                  maxime, exercitationem molestiae minima minus modi nobis
                  architecto doloremque! Adipisci unde cupiditate in quas ab.
                  Possimus praesentium delectus quos commodi, ex neque alias
                  earum porro deserunt asperiores recusandae libero, eligendi
                  similique sit sint facilis, fugit optio ducimus? Quibusdam
                  iure nobis inventore enim, deserunt sapiente quaerat. Ipsam
                  provident, voluptatibus excepturi ipsa nisi quam. Libero hic
                  ut, vitae assumenda asperiores, debitis excepturi ullam
                  quaerat doloremque labore quidem repellendus suscipit omnis
                  cupiditate totam aliquam molestiae dolorum beatae, officiis
                  eaque dolores consectetur nemo? Nobis eum temporibus possimus,
                  repellendus cumque esse quaerat consectetur nihil nostrum ab,
                  doloribus quasi impedit rem veniam. Beatae veniam laboriosam
                  voluptatibus itaque consequatur temporibus ullam quo excepturi
                  impedit! Dolorem ea e
                </p>
              ))}
            </div>
          </div>

          {/* footer (sticky inside panel) */}
          <div className="px-6 py-4 lg:px-8  lg:py-5 border-t flex items-center gap-3 justify-end">
            <button
              onClick={onClose}
              className="max-w-[198px] w-full rounded-xl border text-raisin hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <p className="px-6 py-4 ">Cancel</p>
            </button>
            <button
              onClick={acceptAgreement}
              className="max-w-[198px] px-6 py-4 w-full rounded-xl bg-mikado text-raisin font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              disabled={signing}
            >
              <span className="lg:hidden">Continue</span>
              <span className="hidden lg:inline">I Accept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

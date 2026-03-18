import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, MapPin, Phone, Mail, Star, Download } from "lucide-react";
import { profileSummaryKey } from "../../api/queryKeys";
import { getProfileSummary } from "../../api/dashboard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface IdCardModalProps {
  open: boolean;
  onClose: () => void;
}

export default function IdCardModal({ open, onClose }: IdCardModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Subscribe to profile data (uses cache from dashboard)
  const { data } = useQuery({
    queryKey: profileSummaryKey(),
    queryFn: () => getProfileSummary(),
    staleTime: Infinity, // Use existing data from cache
  });

  const userData = (() => {
    const p = data?.personal_details;
    return {
      name: p?.name ?? "—",
      id: p?.user_id != null ? `#${p.user_id}` : "—",
      location: p?.place ?? "—",
      state: p?.state ?? "—",
      phone: p?.phone ?? p?.mobile ?? "—",
      email: p?.email ?? "—",
      profileImage: p?.image || "/Images/placeholder-image.png",
      status: "Active",
      badge: "Promoting Partner",
    };
  })();

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const ensureImagesLoaded = async (container: HTMLElement) => {
    const images = Array.from(container.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }

            const cleanup = () => {
              img.removeEventListener("load", onLoad);
              img.removeEventListener("error", onError);
            };

            const onLoad = () => {
              cleanup();
              resolve();
            };

            const onError = () => {
              cleanup();
              resolve();
            };

            img.addEventListener("load", onLoad, { once: true });
            img.addEventListener("error", onError, { once: true });
          })
      )
    );
  };

  const getImageDataUrl = async (url: string) => {
    try {
      const response = await fetch(url, { mode: "cors", credentials: "include" });
      if (!response.ok) return null;

      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const getImageDataUrlFromElement = (img: HTMLImageElement | null) => {
    if (!img) return null;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  };

  const printCardAsPdf = (cardElement: HTMLElement, fileName: string) => {
    const printWindow = window.open("", "_blank", "width=1200,height=800");
    if (!printWindow) return;

    const headNodes = Array.from(document.head.querySelectorAll("link, style"))
      .map((node) => node.outerHTML)
      .join("");

    const clonedCard = cardElement.cloneNode(true) as HTMLElement;
    clonedCard.querySelectorAll("[data-html2canvas-ignore='true']").forEach((el) => el.remove());

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${fileName}_ID_Card</title>
          ${headNodes}
          <style>
            @page { size: landscape; margin: 12mm; }
            body {
              margin: 0;
              padding: 20px;
              background: #ffffff;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
          </style>
        </head>
        <body>${clonedCard.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;

    try {
      await ensureImagesLoaded(exportRef.current);
      const displayedProfileImage = exportRef.current.querySelector<HTMLImageElement>(
        "[data-export-profile-image='true']"
      );
      const displayedProfileSrc = displayedProfileImage?.currentSrc || displayedProfileImage?.src;
      const imageFromElement = getImageDataUrlFromElement(displayedProfileImage);
      const safeProfileImage =
        imageFromElement ||
        (await getImageDataUrl(displayedProfileSrc || userData.profileImage));

      if (!safeProfileImage) {
        printCardAsPdf(exportRef.current, userData.name);
        return;
      }

      const canvas = await html2canvas(exportRef.current, {
        useCORS: true,
        scale: 3,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const exportProfileImage = clonedDoc.querySelector<HTMLImageElement>(
            "[data-export-profile-image='true']"
          );
          if (exportProfileImage) {
            exportProfileImage.src = safeProfileImage;
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${userData.name}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!open && !isVisible) return null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out
        ${isAnimating ? "opacity-100" : "opacity-0"} ${!isVisible ? "pointer-events-none" : ""}`}
      />

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none
        ${isVisible ? "" : "pointer-events-none"}`}
      >
        <div
          ref={exportRef}
          className={`bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden relative pointer-events-auto
          transform transition-all duration-300 ease-out
          ${isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            data-html2canvas-ignore="true"
            className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full 
            text-gray-600 hover:text-gray-800 transition-colors shadow-md"
          >
            <X size={20} />
          </button>

          <div
            className={`relative h-36 bg-cover bg-center overflow-hidden transition-all duration-300 ease-out
            ${isAnimating ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: isAnimating ? "50ms" : "0ms" }}
          >
            <img
              src="/Images/id_green.png"
              alt="ID Background"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.background =
                  'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)';
              }}
            />

            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleDownload}
                data-html2canvas-ignore="true"
                className="px-4 py-1 focus:outline-none hover:border-white bg-white/30 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2 text-xs"
              >
                Download Card <Download size={14} className="text-gray-700" />
              </button>
            </div>
          </div>

          <div
            className={`bg-white p-6 pt-16 relative transition-all duration-300 ease-out
            ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: isAnimating ? "100ms" : "0ms" }}
          >
            <div className="absolute top-4 right-4">
              <span className="flex items-center bg-lime-100 px-2.5 py-1 rounded-full 
               text-black text-xs font-medium shadow-sm">
                <Star size={12} className="text-black inline mr-1" />
                <span>{userData.badge}</span>
              </span>
            </div>

            <div
              className={`absolute -top-14 left-6 transition-all duration-300 ease-out
              ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              style={{ transitionDelay: isAnimating ? "150ms" : "0ms" }}
            >
              <div className="relative">
                <img
                  src={userData.profileImage}
                  alt={userData.name}
                  data-export-profile-image="true"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/Images/placeholder-image.png";
                  }}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg block"
                />
                <span className="absolute bottom-0 right-0 bg-lime-500 text-white text-[10px] px-2 py-0.5 
                rounded-full font-bold border-2 border-white shadow-sm">
                  {userData.status}
                </span>
              </div>
            </div>

            <div className="">
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <MapPin size={14} className="text-gray-400 mr-2 flex-shrink-0" />
                <span>{userData.location}</span>
              </div>

              <div className="text-sm font-semibold text-gray-700 mt-1 mb-4">
                {userData.id}
              </div>

              <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>

              <div className="space-y-2 pt-1 flex justify-between flex-wrap">
                <div>
                  <div className="flex items-center text-sm text-gray-700 mb-1">
                    <Phone size={16} className="text-lime-600 mr-2 flex-shrink-0" />
                    <span>{userData.phone}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-700">
                    <Mail size={16} className="text-lime-600 mr-2 flex-shrink-0" />
                    <span>{userData.email}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <div className="text-black">City: <span className="text-gray-600">{userData.location}</span></div>
                  <div className="text-black">State: <span className="text-gray-600">{userData.state}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ModalCambioEstadoProps {
    isOpen: boolean;
    onClose: () => void;
    currentStatus: string;
    onChangeStatus: (newStatus: string) => Promise<void>;
    fetchOrders: () => Promise<void>;
}


export default function ModalCambioEstado({
    isOpen,
    onClose,
    currentStatus,
    onChangeStatus,
    fetchOrders
}: ModalCambioEstadoProps) {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleStatusChange = async () => {
        if (!selectedStatus || selectedStatus === currentStatus) return;

        setIsLoading(true);
        try {
            await onChangeStatus(selectedStatus);
            await fetchOrders();
            toast.success("Estado actualizado correctamente", {
                position: "top-center",
                richColors: true,
            });
            onClose();
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            toast.error("No se pudo actualizar el estado", {
                position: "top-center",
                richColors: true,
            });
        } finally {
            setIsLoading(false);
            setIsConfirmModalOpen(false);
        }
    };

    if (!isOpen) return null;


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[400px] max-h-[90vh] overflow-y-auto mx-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Cambiar Estado
                            </h2>
                            <button
                                type="button"
                                title="Cerrar"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Dropdown de selección de estado */}
                        <div className="mb-4">
                            <select
                                className="w-full mt-2 p-2 border rounded-lg bg-white text-gray-900"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="" disabled>Seleccionar Estado</option>
                                {["PENDIENTE", "REVISION", "CONFIRMADO", "FINALIZADO", "REPARACION", "RETIRADO", "CANCELADO"].map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition cursor-pointer flex items-center gap-2"
                                disabled={selectedStatus === currentStatus}
                                onClick={() => setIsConfirmModalOpen(true)}
                            >
                                Confirmar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* 🔹 Modal de Confirmación */}
            {isConfirmModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[350px] text-center"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">
                            ¿Está seguro de asignar el estado <span className="text-blue-600">{selectedStatus}</span>?
                        </h2>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 cursor-pointer"
                                onClick={handleStatusChange} // 🔹 Actualiza el estado
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="white"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="white"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                )}
                                {isLoading ? "Actualizando..." : "Sí"}
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                                onClick={() => setIsConfirmModalOpen(false)} // 🔹 Cierra el modal sin cambios
                                disabled={isLoading}
                            >
                                No
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

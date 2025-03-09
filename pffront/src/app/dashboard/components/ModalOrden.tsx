"use client";
import { X, RotateCwSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentForm } from "@/app/dashboard/components/PaymentFormAdmin";
import { OrderPaymentUser } from "@/app/dashboard/components/OrderPaymentUser";
import userDataStorage from "@/storage/userStore";
import { updateOrderDescription } from "@/services/orderService";
import orderDataStorage from "@/storage/orderStore";
import { EstadoOrden } from "../types";
import { ButtonCancelar } from "@/components/ButtonCancelar";
import ModalCambioEstado from "./ModalCambioEstado";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: {
    id: string;
    clientEmail: string;
    clientDni: string;
    equipmentType: string;
    imei: string;
    assignedTechnician?: string;
    description: string;
    status: string;
    payments: null | {
      externalOrderId: string | null;
      id: string;
      invoicePaidAt: string | null;
      price: string;
      status: string;
    };
  };
  handleEstadoChange: (id: string, nuevoEstado: EstadoOrden) => void;
  fetchOrders: () => Promise<void>;

}

export default function ModalOrden({
  isOpen,
  onClose,
  order,
  handleEstadoChange,
  fetchOrders
}: ModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { userData } = userDataStorage();
  const isAdmin = userData?.role === "ADMIN";
  const isUser = userData?.role === "CLIENT";
  const isTechn = userData?.role === "TECHN";
  const [descripcion, setDescripcion] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isModalCambioEstadoOpen, setIsModalCambioEstadoOpen] = useState(false); // Estado para el modal de cambio de estado

  useEffect(() => {

    setDescripcion("");

  }, [order]);

  if (!isOpen || !order) return null;

  const handlePayment = async (price: string, orderId: string, orderPaymetId: string) => {
    const monto = Number(price);
    if (monto <= 0) return;
    setIsProcessing(true);

    const order = {
      clientId: "1",
      title: orderId,
      description: "description",
      quantity: 1,
      unit_price: Number(monto),
      productId: orderId,
      external: orderPaymetId,
    };

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.init_point) {
        window.open(data.init_point, "_blank"); // Redirige a MercadoPago en pestaña nueva
      }
    } catch (error) {
      console.error("Error en el pago:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleClose = () => {
    if (isEditing) {
      setShowConfirmation(true);
    } else {
      onClose(); // Cerrar directamente si no está editando
    }
  };

  const handleDescriptionSave = async () => {
    try {
      const response = await updateOrderDescription(order.id, descripcion);
      if (response) {
        // Actualizamos solo la descripción, manteniendo los demás valores
        const order = orderDataStorage.getState().orderData.find(order => order.id === response.id);
        if (order) {
          orderDataStorage.getState().updateOrder({
            ...order, // Mantenemos el resto de los valores
            description: response.description, // Solo actualizamos la descripción
          });
        }
      }
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[480px] max-h-[90vh] overflow-y-auto mx-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalle de orden
              </h2>
              <button
                type="button"
                title="Cerrar"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {showConfirmation && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    ¿Está seguro de cerrar sin guardar los cambios?
                  </p>
                  <div className="flex justify-center gap-4">

                    <button
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                      onClick={() => {
                        setShowConfirmation(false);
                        setIsEditing(false);
                        onClose();
                      }}
                    >
                      Sí
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      onClick={() => setShowConfirmation(false)} // Cancelar
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-6">
              <div>
                <div className="flex">
                  <label className="text-bodyBold font-bold text-gray-700 pr-2">
                    Estado:
                  </label>
                  {isAdmin && order.status !== "CANCELADO" && order.status !== "RETIRADO" && (

                    <span title="Cambiar Estado">
                      <RotateCwSquare
                        size={18}
                        className="ml-2 cursor-pointer text-gray-800 hover:text-gray-600 transition"
                        onClick={() => setIsModalCambioEstadoOpen(true)} // Abre el modal
                      />
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 font-medium text-gray-700`}
                >
                  {order.status}
                </p>
              </div>
              <div>
                <label className="text-bodyBold font-bold text-gray-700">
                  Dispositivo:
                </label>
                <p className="mt-1 text-gray-900">{order.equipmentType}</p>
              </div>
              <div>
                <label className="text-bodyBold font-bold text-gray-700">
                  ID Orden:
                </label>
                <p className="mt-1 text-gray-900 truncate" title={order.id}>
                  {order.id}
                </p>
              </div>
              <div>
                <label className="text-bodyBold font-bold text-gray-700">
                  Email Cliente:
                </label>
                <p className="mt-1 text-gray-900 truncate" title={order.id}>
                  {order.clientEmail}
                </p>
              </div>
              <div>
                <label className="text-bodyBold font-bold text-gray-700">
                  Dni Cliente:
                </label>
                <p className="mt-1 text-gray-900 truncate" title={order.id}>
                  {order.clientDni}
                </p>
              </div>

              {isUser && (
                <div>
                  <label className="text-bodyBold font-bold text-gray-700">
                    Descripción:
                  </label>
                  <p className="text-gray-700 border border-gray-300 rounded-lg px-2 py-2 max-h-[120px] overflow-y-auto">
                    {order.description}
                  </p>
                </div>
              )}

              {(isAdmin || isTechn) && (
                <div className="flex flex-col gap-2">

                  <label className="text-bodyBold font-bold text-gray-700">Descripción:</label>

                  {isEditing ? (
                    <>
                      <textarea
                        placeholder="Ingrese una descripción detallada aquí..."
                        className="mt-1 w-full text-black p-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-[120px] resize-none"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      />
                      <button
                        onClick={handleDescriptionSave}
                        className="px-4 py-2 text-white font-semibold bg-slate-500 rounded-lg transition-colors duration-200 hover:bg-slate-600"
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-bodyBold font-bold text-gray-700  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-h-[120px] overflow-y-auto py-2 px-2">{order.description}</p>
                      <button
                        className="px-4 py-2 text-white font-semibold bg-slate-500 rounded-lg transition-colors duration-200 hover:bg-slate-600"
                        onClick={() => {
                          setIsEditing(true);
                          setDescripcion(order.description)
                        }}
                      >
                        Editar
                      </button>
                    </>
                  )}
                </div>
              )}


              {(isUser || isAdmin && order.status !== ("REVISION") && order.payments?.status === "PENDING") && (
                <div className="mb-4">
                  <label className="text-bodyBold font-bold text-gray-700">Monto a pagar:</label>
                  <p className="text-gray-700">$ {order.payments?.price}</p>
                </div>
              )}
              {((isUser || isAdmin) && order.payments?.status === "APPROVED") && (
                <div className="mb-4">
                  <label className="text-bodyBold font-bold text-gray-700">Monto a pagar:</label>
                  <p className="text-gray-700">$ {order.payments?.price}</p>
                  <p className="text-gray-700">ID de Pago: {order.payments?.id}</p>
                  <p className="text-gray-700">Pago Aprobado</p>
                </div>
              )}
            </div>
            {isAdmin &&
              order.status !== "FINALIZADO" &&
              order.status !== "CANCELADO" &&
              order.status !== "RETIRADO" &&
              !(order.status === "REVISION" && order.payments !== null) && (
                <ButtonCancelar
                  orderId={order.id}
                  onClose={onClose} />
              )}

            {(isAdmin && order.status === "REVISION" && order.payments === null) && (
              <div className="space-y-2 mb-4">
                <PaymentForm orderId={order.id} onClose={onClose} />
              </div>
            )}

            {isUser && order.status === "REVISION" && order.payments !== null && (
              <div className="space-y-2 mb-4">
                <OrderPaymentUser orderId={order?.id} price={order?.payments?.price} onClose={onClose} />
              </div>
            )}

            {(isUser && ["CONFIRMADO", "FINALIZADO", "REPARACION"].includes(order.status) && order.payments?.status === "PENDING") && (

              <div className="space-y-3">
                <button
                  onClick={() => handlePayment(order.payments?.price ?? '0', order.id, order.payments?.id ?? '')}
                  className={`w-full px-4 py-2 text-bodyBold text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 bg-primary-500 hover:bg-primary-600 ${isProcessing ? "cursor-not-allowed" : ""}`}
                >
                  {isProcessing ? (
                    <>
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
                      <span>Procesando...</span>
                    </>
                  ) : (
                    "Pagar"
                  )}
                </button>
              </div>
            )}

            {(isTechn || isAdmin) && order.status === "PENDIENTE" && (
              <button
                onClick={() => handleEstadoChange(order.id, "REVISION")}
                className="w-full px-4 py-2 text-bodyBold text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 bg-blue-500 hover:bg-blue-600"
              >
                Revisión
              </button>
            )}

            {(isTechn || isAdmin) && order.status === "CONFIRMADO" && (
              <button
                onClick={() => handleEstadoChange(order.id, "REPARACION")}
                className="w-full px-4 py-2 text-bodyBold text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 bg-orange-500 hover:bg-orange-600"
              >
                Reparación
              </button>
            )}

            {(isTechn || isAdmin) && order.status === "REPARACION" && (
              <button
                onClick={() => handleEstadoChange(order.id, "FINALIZADO")}
                className="w-full px-4 py-2 text-bodyBold text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 bg-green-500 hover:bg-green-600"
              >
                Finalizar
              </button>
            )}

            {isAdmin &&
              ((order.status === "FINALIZADO" && order.payments?.status === "APPROVED") ||
                order.status === "CANCELADO") && (
                <button
                  onClick={() => handleEstadoChange(order.id, "RETIRADO")}
                  className="w-full px-4 py-2 text-bodyBold text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 bg-green-500 hover:bg-green-600"
                >
                  Retirado
                </button>
              )}

            <ModalCambioEstado
              isOpen={isModalCambioEstadoOpen}
              onClose={() => setIsModalCambioEstadoOpen(false)}
              currentStatus={order.status}
              onChangeStatus={(newStatus) => Promise.resolve(handleEstadoChange(order.id, newStatus as EstadoOrden))} // 🔹 Asegura que devuelva un `Promise<void>`
              fetchOrders={fetchOrders}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

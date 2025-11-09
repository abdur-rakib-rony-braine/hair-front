"use client";

import { useState } from "react";
import { Search, Plus, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ServiceTable from "./components/ServiceTable";
import ServiceModal from "./components/ServiceModal";
import DeleteAlert from "./components/DeleteAlert";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description: string;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Hair Cut & Styling",
      price: 45,
      duration: 60,
      category: "Hair",
      description: "Professional haircut with styling",
      isActive: true,
    },
    {
      id: "2",
      name: "Hair Color",
      price: 85,
      duration: 120,
      category: "Hair",
      description: "Full hair coloring service",
      isActive: true,
    },
    {
      id: "3",
      name: "Manicure",
      price: 25,
      duration: 45,
      category: "Nails",
      description: "Classic manicure with polish",
      isActive: true,
    },
    {
      id: "4",
      name: "Pedicure",
      price: 35,
      duration: 60,
      category: "Nails",
      description: "Relaxing pedicure treatment",
      isActive: true,
    },
    {
      id: "5",
      name: "Facial Treatment",
      price: 65,
      duration: 75,
      category: "Skincare",
      description: "Deep cleansing facial",
      isActive: true,
    },
    {
      id: "6",
      name: "Eyebrow Shaping",
      price: 20,
      duration: 30,
      category: "Beauty",
      description: "Professional eyebrow threading",
      isActive: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const categories = ["all", "Hair", "Nails", "Skincare", "Beauty"];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    setDeletingService(service);
  };

  const confirmDelete = () => {
    if (deletingService) {
      setServices(services.filter((s) => s.id !== deletingService.id));
      setDeletingService(null);
    }
  };

  const handleSaveService = (serviceData: Omit<Service, "id">) => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? { ...serviceData, id: editingService.id }
            : s
        )
      );
    } else {
      const newService: Service = {
        ...serviceData,
        id: Date.now().toString(),
      };
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
  };

  const activeServices = services.filter((s) => s.isActive).length;
  const averagePrice = Math.round(
    services.reduce((acc, s) => acc + s.price, 0) / services.length
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Services</h1>
            <p className="text-slate-600">
              Manage your salon services and pricing
            </p>
          </div>
          <Button
            onClick={handleAddService}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Service
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <ServiceTable
          services={filteredServices}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {services.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {activeServices}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Price
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${averagePrice}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveService}
          service={editingService}
        />

        <DeleteAlert
          isOpen={!!deletingService}
          onClose={() => setDeletingService(null)}
          onConfirm={confirmDelete}
          serviceName={deletingService?.name || ""}
        />
      </div>
    </div>
  );
}

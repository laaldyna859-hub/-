import { useState } from "react";
import { Link } from "wouter";
import { useGetStatsSummary, useListOrders, useListProducts, useCreateProduct, useUpdateOrderStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, DollarSign, LayoutDashboard, Plus, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: stats, isLoading: statsLoading } = useGetStatsSummary();
  const { data: orders, isLoading: ordersLoading } = useListOrders();
  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useListProducts();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();

  const handleStatusChange = (orderId: number, status: any) => {
    updateStatus.mutate({
      id: orderId,
      data: { status }
    }, {
      onSuccess: () => {
        toast({ title: "تم تحديث الحالة بنجاح" });
      }
    });
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'تم التأكيد';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-card border-l shrink-0 md:h-screen sticky top-0">
        <div className="p-6 border-b">
          <h2 className="font-serif font-bold text-2xl text-primary">لوحة الإدارة</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Button 
            variant={activeTab === "dashboard" ? "default" : "ghost"} 
            className="w-full justify-start text-lg"
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="ml-3 h-5 w-5" /> الإحصائيات
          </Button>
          <Button 
            variant={activeTab === "orders" ? "default" : "ghost"} 
            className="w-full justify-start text-lg"
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="ml-3 h-5 w-5" /> الطلبات
          </Button>
          <Button 
            variant={activeTab === "products" ? "default" : "ghost"} 
            className="w-full justify-start text-lg"
            onClick={() => setActiveTab("products")}
          >
            <Package className="ml-3 h-5 w-5" /> المنتجات
          </Button>
          <div className="pt-8 mt-8 border-t">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start">العودة للموقع</Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">ملخص الأداء</h2>
            
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">طلبات قيد الانتظار</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats?.pendingOrders || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {stats?.totalRevenue?.toLocaleString("ar-EG") || 0} ج.م
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">إدارة الطلبات</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="p-4 font-bold">رقم الطلب</th>
                        <th className="p-4 font-bold">العميل</th>
                        <th className="p-4 font-bold">الهاتف</th>
                        <th className="p-4 font-bold">الإجمالي</th>
                        <th className="p-4 font-bold">الحالة</th>
                        <th className="p-4 font-bold">التاريخ</th>
                        <th className="p-4 font-bold">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersLoading ? (
                        <tr><td colSpan={7} className="p-4 text-center">جاري التحميل...</td></tr>
                      ) : orders?.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">لا توجد طلبات</td></tr>
                      ) : (
                        orders?.map(order => (
                          <tr key={order.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-mono">#{order.id}</td>
                            <td className="p-4">{order.customerName}</td>
                            <td className="p-4" dir="ltr">{order.phone}</td>
                            <td className="p-4 font-bold">{order.total.toLocaleString("ar-EG")} ج.م</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {getStatusText(order.status)}
                              </span>
                            </td>
                            <td className="p-4">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                            <td className="p-4">
                              <Select 
                                value={order.status} 
                                onValueChange={(val) => handleStatusChange(order.id, val)}
                              >
                                <SelectTrigger className="w-32 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                                  <SelectItem value="confirmed">تم التأكيد</SelectItem>
                                  <SelectItem value="delivered">تم التوصيل</SelectItem>
                                  <SelectItem value="cancelled">إلغاء</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">المنتجات</h2>
              <Button><Plus className="ml-2 h-4 w-4" /> إضافة منتج جديد</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsLoading ? (
                [1,2,3,4].map(i => <Skeleton key={i} className="h-64" />)
              ) : (
                products?.map(product => (
                  <Card key={product.id}>
                    <div className="aspect-square bg-muted rounded-t-xl overflow-hidden">
                      <img src={product.images[0] || '/images/placeholder.png'} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-1 line-clamp-1">{product.name}</h3>
                      <div className="text-primary font-bold mb-4">{product.price.toLocaleString("ar-EG")} ج.م</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">تعديل</Button>
                        <Button variant="destructive" size="sm" className="flex-1">حذف</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
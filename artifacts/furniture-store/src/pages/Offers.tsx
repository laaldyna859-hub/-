import { Layout } from "@/components/Layout";
import { useListOffers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { Link } from "wouter";

export default function Offers() {
  const { data: offers, isLoading } = useListOffers();

  return (
    <Layout>
      <div className="bg-destructive/10 py-16 border-b border-destructive/20 relative overflow-hidden">
        <div className="absolute top-10 right-10 opacity-10">
          <Tag className="w-64 h-64 text-destructive" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-destructive mb-6">العروض والتخفيضات</h1>
          <p className="text-lg text-destructive/80 max-w-2xl mx-auto">
            استفد من أقوى العروض على تشكيلتنا المميزة لفترة محدودة.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers?.filter(o => o.isActive).map((offer) => (
              <Link key={offer.id} href={`/products?offer=true`}>
                <Card className="overflow-hidden border-destructive/20 hover:border-destructive/50 transition-colors group cursor-pointer bg-card">
                  <div className="flex flex-col sm:flex-row h-full">
                    {offer.image && (
                      <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto overflow-hidden shrink-0">
                        <img 
                          src={offer.image} 
                          alt={offer.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardContent className="p-8 flex flex-col justify-center flex-1">
                      <Badge variant="destructive" className="w-fit mb-4 text-sm px-3 py-1">خصم {offer.discountPercent}%</Badge>
                      <h3 className="text-2xl font-bold mb-3">{offer.title}</h3>
                      <p className="text-muted-foreground mb-6">{offer.description}</p>
                      {offer.validUntil && (
                        <div className="text-sm font-medium text-destructive mt-auto">
                          ساري حتى: {new Date(offer.validUntil).toLocaleDateString('ar-EG')}
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
            
            {/* Fallback offer if API is empty */}
            {(!offers || offers.length === 0) && (
              <Link href="/products">
                <Card className="overflow-hidden border-destructive/20 hover:border-destructive/50 transition-colors group cursor-pointer bg-card col-span-1 md:col-span-2">
                  <CardContent className="p-12 text-center bg-destructive/5">
                    <Badge variant="destructive" className="mb-6 text-sm px-4 py-1.5 text-lg">عرض الموسم</Badge>
                    <h3 className="text-3xl font-bold mb-4 text-foreground">خصومات تصل إلى 30% على غرف النوم</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">تشكيلة مختارة من غرف النوم الكلاسيكية والحديثة بأفضل الأسعار. العرض ساري لفترة محدودة.</p>
                    <div className="inline-flex h-12 items-center justify-center rounded-md bg-destructive px-8 text-sm font-medium text-destructive-foreground shadow transition-colors hover:bg-destructive/90">
                      تسوق العروض الآن
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
import { Layout } from "@/components/Layout";
import { useListPortfolio } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Portfolio() {
  const { data: items, isLoading } = useListPortfolio();

  return (
    <Layout>
      <div className="bg-primary/5 py-16 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">أعمالنا المنفذة</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نفخر بتقديم أفضل مستوى من الجودة والتشطيب لعملائنا. شاهد بعضاً من أعمالنا على الطبيعة.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items?.map((item) => (
              <Card key={item.id} className="overflow-hidden border-border/50 group">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img 
                    src={item.images[0] || "/images/portfolio-1.png"} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    {item.customerName && (
                      <p className="text-white/80 text-sm">منزل العميل: {item.customerName}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Fallback items if API is empty */}
            {(!items || items.length === 0) && [1, 2, 3, 4].map((i) => (
              <Card key={`fb-${i}`} className="overflow-hidden border-border/50 group">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img 
                    src="/images/portfolio-1.png" 
                    alt="مشروع منفذ"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl">فرش فيلا بالتجمع الخامس</h3>
                    <p className="text-white/80 text-sm mt-2">تصميم كلاسيك حديث</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
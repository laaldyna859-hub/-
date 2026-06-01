import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { useLocation } from "wouter";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || "");
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  
  // Use debounced search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  // Update debounced search
  // useEffect(() => {
  //   const timer = setTimeout(() => setDebouncedSearch(search), 500);
  //   return () => clearTimeout(timer);
  // }, [search]);

  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({
    search: debouncedSearch || undefined,
    category: category !== "all" ? category : undefined,
    sort: sort as any,
  });

  return (
    <Layout>
      <div className="bg-primary/5 py-12 border-b border-primary/10">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">المنتجات</h1>
          <p className="text-muted-foreground max-w-2xl">تصفح تشكيلتنا الواسعة من الأثاث الفاخر المصمم لتلبية أرقى الأذواق.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="bg-card p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 mb-6 font-bold text-lg border-b pb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <span>تصفية النتائج</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block text-foreground/80">بحث</label>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="اسم المنتج..." 
                      className="pl-4 pr-10"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setDebouncedSearch(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block text-foreground/80">القسم</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقسام</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block text-foreground/80">الترتيب</label>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="الترتيب حسب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">الأحدث</SelectItem>
                      <SelectItem value="price_asc">السعر: من الأقل</SelectItem>
                      <SelectItem value="price_desc">السعر: من الأعلى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-[400px] rounded-xl" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">لم نجد أية منتجات</h3>
                <p className="text-muted-foreground">جرب تغيير كلمات البحث أو إزالة بعض الفلاتر.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
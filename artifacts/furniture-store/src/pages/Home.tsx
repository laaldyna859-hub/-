import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetFeaturedProducts, useListCategories, useListTestimonials } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, ShieldCheck, Truck, Clock, HeadphonesIcon, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useGetFeaturedProducts();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const { data: testimonials, isLoading: testimonialsLoading } = useListTestimonials();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="أثاث فاخر" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              فخامة تليق بمنزلك
            </h1>
            <p className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto text-white/90 drop-shadow">
              نصنع أثاثاً يعكس ذوقك الرفيع، بجودة تدوم لأجيال وتصاميم تجمع بين الأصالة والمعاصرة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg h-14 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto">
                  تصفح التشكيلة الجديدة
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 text-white border-white/30 hover:bg-white/20 w-full sm:w-auto">
                  شاهد أعمالنا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">تسوق حسب القسم</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories?.slice(0, 4).map((category) => (
                <Link key={category.id} href={`/products?category=${category.slug}`}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted"
                  >
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-serif text-xl font-bold">{category.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                      <h3 className="text-white text-xl font-bold group-hover:text-secondary transition-colors">{category.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">الأكثر مبيعاً</h2>
              <div className="w-24 h-1 bg-secondary rounded-full" />
            </div>
            <Link href="/products?featured=true" className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors">
              عرض الكل <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-[400px] rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products?featured=true">
              <Button variant="outline" className="w-full">عرض الكل</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">لماذا نحن؟</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <ShieldCheck className="h-10 w-10" />, title: "جودة مضمونة", desc: "نستخدم أفضل أنواع الأخشاب والمواد الخام لضمان أثاث يدوم طويلاً." },
              { icon: <Star className="h-10 w-10" />, title: "تصاميم حصرية", desc: "نقدم تصاميم فريدة تجمع بين اللمسة الكلاسيكية والراحة العصرية." },
              { icon: <Truck className="h-10 w-10" />, title: "توصيل وتركيب", desc: "خدمة توصيل وتركيب احترافية لجميع المحافظات." },
              { icon: <HeadphonesIcon className="h-10 w-10" />, title: "خدمة ما بعد البيع", desc: "فريق متخصص للرد على استفساراتكم وتقديم الدعم اللازم." }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-20 h-20 mx-auto rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-primary-foreground/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">آراء عملائنا</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials?.slice(0, 3).map((t) => (
                <div key={t.id} className="bg-muted/50 p-8 rounded-2xl relative">
                  <div className="flex items-center gap-1 mb-4 text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < t.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <p className="text-lg italic text-foreground/80 mb-6 relative z-10">"{t.comment}"</p>
                  <div className="flex items-center gap-4">
                    {t.image ? (
                      <img src={t.image} alt={t.customerName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">
                        {t.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold">{t.customerName}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
import { Layout } from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="من نحن" 
            className="w-full h-full object-cover object-center filter grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-5xl font-bold mb-4 drop-shadow-md">قصتنا</h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow text-white/90">
            تاريخ من الأصالة والإبداع في عالم صناعة الأثاث الفاخر.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-6">تراث يمتد لعقود</h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              بدأت رحلتنا من ورشة صغيرة لنجارة الأخشاب، واليوم نفخر بأننا من أهم معارض الأثاث في مصر. توارثنا المهنة جيلاً بعد جيل، وحافظنا على أسرار الصنعة التي تجعل من كل قطعة أثاث تحفة فنية تدوم طويلاً.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              نؤمن بأن الأثاث ليس مجرد قطع خشبية، بل هو روح المنزل والقصة التي تروى في كل غرفة. لذلك نحرص على انتقاء أفضل أنواع الأخشاب كالزان والبلوط، ونستخدم أرقى الأقمشة العالمية لتقديم تجربة جلوس ونوم استثنائية.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/portfolio-1.png" alt="تفاصيل الخشب" className="w-full aspect-square object-cover rounded-2xl shadow-lg mt-8" />
            <img src="/images/product-sofa.png" alt="أثاث راقي" className="w-full aspect-square object-cover rounded-2xl shadow-lg" />
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-12 lg:p-20 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary mb-12">رؤيتنا ورسالتنا</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-right">
            <div className="bg-card p-8 rounded-2xl shadow-sm border">
              <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mb-6 text-2xl font-bold">الرؤية</div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                أن نكون الوجهة الأولى في مصر والشرق الأوسط لكل من يبحث عن الأثاث الفاخر ذو الجودة الاستثنائية والتصميم الفريد الذي يعكس الفخامة والأصالة.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6 text-2xl font-bold">الرسالة</div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                تقديم منتجات أثاث عالية الجودة تجمع بين الراحة المطلقة واللمسة الجمالية الساحرة، مع تقديم خدمة عملاء احترافية تبني علاقات طويلة الأمد مع عملائنا.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
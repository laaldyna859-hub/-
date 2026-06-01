import { Link } from "wouter";
import { Phone, MapPin, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6">معرض الأثاث الفاخر</h3>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              نقدم لكم أرقى تشكيلات الأثاث المنزلي المصنوعة بأيدي أمهر الحرفيين المصريين. جودة تدوم لأجيال وتصاميم تجمع بين الأصالة والمعاصرة.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-primary-foreground/20 pb-2 inline-block">روابط سريعة</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-primary-foreground/80 hover:text-secondary transition-colors">الرئيسية</Link></li>
              <li><Link href="/products" className="text-primary-foreground/80 hover:text-secondary transition-colors">المنتجات</Link></li>
              <li><Link href="/offers" className="text-primary-foreground/80 hover:text-secondary transition-colors">العروض الخاصة</Link></li>
              <li><Link href="/portfolio" className="text-primary-foreground/80 hover:text-secondary transition-colors">أعمالنا</Link></li>
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors">من نحن</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-primary-foreground/20 pb-2 inline-block">الأقسام</h4>
            <ul className="space-y-4">
              <li><Link href="/products?category=bedrooms" className="text-primary-foreground/80 hover:text-secondary transition-colors">غرف النوم</Link></li>
              <li><Link href="/products?category=dining" className="text-primary-foreground/80 hover:text-secondary transition-colors">غرف الطعام</Link></li>
              <li><Link href="/products?category=living" className="text-primary-foreground/80 hover:text-secondary transition-colors">غرف المعيشة</Link></li>
              <li><Link href="/products?category=salons" className="text-primary-foreground/80 hover:text-secondary transition-colors">الصالونات</Link></li>
              <li><Link href="/products?category=accessories" className="text-primary-foreground/80 hover:text-secondary transition-colors">الإكسسوارات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-primary-foreground/20 pb-2 inline-block">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-1" />
                <span className="text-primary-foreground/80">شارع التسعين الشمالي، التجمع الخامس، القاهرة، مصر</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-primary-foreground/80" dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-primary-foreground/80">info@luxuryfurniture.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} معرض الأثاث الفاخر. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-sm text-primary-foreground/60">
            <a href="#" className="hover:text-secondary">الشروط والأحكام</a>
            <a href="#" className="hover:text-secondary">سياسة الخصوصية</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
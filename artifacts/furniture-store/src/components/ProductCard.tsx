import { Link } from "wouter";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@workspace/api-client-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images?.[0],
    });
    toast({
      title: "تم الإضافة بنجاح",
      description: `تمت إضافة ${product.name} إلى السلة.`,
    });
  };

  const image = product.images?.[0] || "/images/placeholder.png";

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.isOffer && product.discountPercent && (
            <div className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              خصم {product.discountPercent}%
            </div>
          )}
          <img
            src={image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Button variant="secondary" size="icon" className="rounded-full shadow-lg h-10 w-10">
              <Eye className="h-5 w-5" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full shadow-lg h-10 w-10"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-5 flex-grow flex flex-col">
          <div className="text-sm text-muted-foreground mb-2">{product.categoryName}</div>
          <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2">{product.name}</h3>
          <div className="mt-auto flex items-center gap-3">
            <span className="text-xl font-bold text-primary">
              {product.price.toLocaleString("ar-EG")} ج.م
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toLocaleString("ar-EG")} ج.م
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
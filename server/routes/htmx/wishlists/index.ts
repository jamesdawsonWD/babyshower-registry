type Product = {
    id: number;
    title: string;
    url: string;
    image: string;
    selected: boolean;
    price: string;
};

import { selectedItems } from "~/routes/htmx/wishlists/select";
import { loadTemplate, loadView } from "~/utils/templates";
import Handlebars from "handlebars";

export const products: Product[] = [
    {
        "id": 1,
        "title":
            "Foot Finders & Wrist Rattles for Infants Developmental Texture Toys for Babies & Infant Toy Socks & Baby Wrist Rattle - Newborn Toys for Baby Girls Boys - Baby Boy Girl Toys 0-3 3-6 6-9 Months",
        "url":
            "https://www.amazon.co.uk/Finders-Rattles-Infants-Developmental-Texture/dp/B08GY6PQPX",
        "image":
            "https://m.media-amazon.com/images/I/71XV9pHuC6L.__AC_SY300_SX300_QL70_ML2_.jpg",
        "price": "£11",
        "selected": false,
    },
    {
        "id": 2,
        "title":
            "URMYWO Baby Toys 0-6 Months, Black and White Sensory Toys Brain Development, Tummy Time Toys, Soft Baby Book, Baby Essentials for Newborn 0-6-12 Months Newborn Toys Baby Gifts",
        "url":
            "https://www.amazon.co.uk/URMYWO-Sensory-Development-Essentials-Montessori/dp/B0CNRHV94B",
        "image":
            "https://m.media-amazon.com/images/I/81txRxXd48L.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£6",
        "selected": false,
    },
    {
        "id": 3,
        "title":
            "PROACC Tummy Time Mirror Toys, Baby Toys 0-6 Months Mirror Floor Toy Flip Soft Cloth Book, Black and White Sensory Toys Activity Montessori Newborn Floor Toys for Boys Girls Gifts 0 3 6 Months, Black",
        "url":
            "https://www.amazon.co.uk/PROACC-Tummy-Time-Mirror-Toys/dp/B0CK1Z13PX",
        "image":
            "https://m.media-amazon.com/images/I/81UWoS0DLBL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£9.9",
        "selected": false,
    },
    {
        "id": 4,
        "title":
            "Hooded Baby Towel,Ultra Soft And Super Absorbent Baby Bath Towels,Hooded Baby Towel for Newborns, Suitable As Baby",
        "url":
            "https://www.amazon.co.uk/Hooded-Absorbent-Newborns-Toddlers-Suitable/dp/B0BHY3SX8P",
        "image":
            "https://m.media-amazon.com/images/I/51hKsNMDHsL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£2.8",
        "selected": false,
    },
    {
        "id": 5,
        "title":
            "Tommee Tippee Newborn Dummies, 0-2 months, Muted Colours, Matte Texture, Reusable Steriliser Pod, Pack of 6 dummies",
        "url":
            "https://www.amazon.co.uk/Tommee-Tippee-Soothers-Reusable-Steriliser/dp/B0CL9PNV38",
        "image":
            "https://m.media-amazon.com/images/I/61aiNgK0cPL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£10",
        "selected": false,
    },
    {
        "id": 6,
        "title":
            "Aloonii 5 Pack Luxury Muslin Squares | Cute Small Baby Burp Cloths (Peach)",
        "url":
            "https://www.amazon.co.uk/Muslin-Squares-Cloths-Aloonii-Peach/dp/B097C3ZQ7X",
        "image":
            "https://m.media-amazon.com/images/I/515evssWbCS.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£10",
        "selected": false,
    },
    {
        "id": 7,
        "title":
            "LAWKUL Baby Blanket 100% Cotton Knit Soft Breathable Blankets for Newborn Boy Girl, Dinosaur Green, Pram/Mose Basket(90x70cm)",
        "url":
            "https://www.amazon.co.uk/LAWKUL-Blanket-Breathable-Blankets-Dinosaur/dp/B0C4Y7MJHN",
        "image":
            "https://m.media-amazon.com/images/I/81DWvadbsvL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£14",
        "selected": false,
    },
    {
        "id": 8,
        "title":
            "Moonkie Baby Bibs, 3Pcs Silicone Feeding Bibs for Babies and Toddlers, Waterproof weaning bib, BPA Free Soft Adjustable Wide Food Crumb Catcher Pocket(Cream/Buck/Olive Green)…",
        "url":
            "https://www.amazon.co.uk/Blissbury-Silicone-Unisex-Toddlers-Waterproof/dp/B08LK8DQ3W",
        "image":
            "https://m.media-amazon.com/images/I/61HZos8tBgL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£10",
        "selected": false,
    },
    {
        "id": 9,
        "title": "The Very Hungry Caterpillar Little Library",
        "url":
            "https://www.amazon.co.uk/Very-Hungry-Caterpillar-Little-Library/dp/B0037QPFT0",
        "image":
            "https://m.media-amazon.com/images/I/7135LwrVbTL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "Price not found",
        "selected": false,
    },
    {
        "id": 10,
        "title":
            "Baby Washcloths 100% Organic Bamboo Bath Washcloth Reusable Face Towels Anti-Bacterial Soft Towel Set Perfect for Newborn(5 Pack)",
        "url":
            "https://www.amazon.co.uk/Baby-Washcloths-Washcloth-Reusable-Anti-Bacterial/dp/B089QD6XYJ",
        "image":
            "https://m.media-amazon.com/images/I/51jBszLMKZL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£9",
        "selected": false,
    },
    {
        "id": 11,
        "title":
            "MiniDream Baby Play Mat, Activity Playmat for Baby Floor Play with Six Detachable Toys, Tummy Time Pillow & Baby Safe Mirror, Baby Sensory Tool Padded with Organic Cotton for Infants and Newborn",
        "url":
            "https://www.amazon.co.uk/MiniDream-Playmat-Detachable-Sensory-Organic/dp/B0B4DT9MYM",
        "image":
            "https://m.media-amazon.com/images/I/71iI2rjTtpL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£37",
        "selected": false,
    },
    {
        "id": 12,
        "title":
            "TT TUMMYTIMEZ Premium Tummy Time Water Mat, Extra Large Multi-Stage Activity Center Promoting Baby Motor & Sensory Development, Inflatable Playmat Visual Stimulation Gift Infants Toddlers Boys Girls",
        "url":
            "https://www.amazon.co.uk/TT-Tummytimez-Inflatable-Activity-Development/dp/B08P9VRY18",
        "image":
            "https://m.media-amazon.com/images/I/91fVBE0RfvL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£23",
        "selected": false,
    },
    {
        "id": 13,
        "title":
            "OKBABY ECO Onda Baby Compact Shower Bath - Recycled Plastic - Ergonomic Design with Non-Slip Seat for Newborn Baby Bath 0-12 Months",
        "url":
            "https://www.amazon.co.uk/OKBABY-ECO-Onda-Baby-Bath/dp/B0BHZ1P7DB",
        "image":
            "https://m.media-amazon.com/images/I/51UcD+zykQL._AC_SY300_SX300_.jpg",
        "price": "£19",
        "selected": false,
    },
    {
        "id": 14,
        "title": "Luxury Velvet Baby Carrier - Onyx Black",
        "url":
            "https://bizzigrowin.com/products/nomad-baby-carrier-onyx-black?variant=40190005444688",
        "image":
            "https://bizzigrowin.com/cdn/shop/files/image000091_720x.png?v=1733826860",
        "price": "£55.99",
        "selected": false,
    },
    {
        "id": 15,
        "title": "Leopard Print Baby Carrier - Wildcat",
        "url":
            "https://bizzigrowin.com/products/leopard-print-carrier?srsltid=AfmBOopm1KT8_jiKFBJaSteQCN-fbbzrjEY4AT3nGROwbKEXtVv3O4Xc&variant=40465582915664",
        "image":
            "https://bizzigrowin.com/cdn/shop/files/BizziGrowin_9_720x.png?v=1706267422",
        "price": "£59.99",
        "selected": false,
    },
    {
        "id": 16,
        "title":
            "baby new-born Bassinet - Foldable Bassinet, Folding Bassinet, Portable Babies Bed | Lounger, And Travel Crib, Foldable with Breathable Mesh Nets and Bedside Sleeper, new-born Outdoor Travel",
        "url":
            "https://www.amazon.co.uk/baby-new-born-Bassinet-Foldable-Breathable/dp/B0DHCS9B75",
        "image":
            "https://m.media-amazon.com/images/I/61uk+-DtVNL._AC_SY300_SX300_.jpg",
        "price": "£35",
        "selected": false,
    },
    {
        "id": 17,
        "title":
            "nurturem Baby Swaddle Wrap Newborn 0-6 Month (Pack of 4, Multicolour) - 100% Organic Cotton, Self Fastening Swaddles for Newborn - Machine Washable Newborn Swaddle Blanket for All Year Round Use",
        "url":
            "https://www.amazon.co.uk/Baby-Swaddle-Wraps-Organic-Blankets/dp/B08LQXL8FM",
        "image":
            "https://m.media-amazon.com/images/I/91ZXrOf0EIL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£25",
        "selected": false,
    },
    {
        "id": 18,
        "title":
            "Naxudcoo 8 in 1 Baby High Chair: Portable High Chairs for Babies and Toddlers from 6+ Months, Baby Chair with Washable Seating Removable Feeding Tray Baby High Chairs 6 Months Plus",
        "url":
            "https://www.amazon.co.uk/Naxudcoo-Baby-High-Chair-Removable/dp/B0D9XHVMSC",
        "image":
            "https://m.media-amazon.com/images/I/61vmO0PwlHL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£89",
        "selected": false,
    },
    {
        "id": 19,
        "title":
            "SZJIAHTM 4 Pack Of baby Toddler Soft Cotton Vintage Flower Print Feeding Drooling Breathable Bibs Adjustable Snap Teething Bibs For boys Girls 0-18 Months",
        "url":
            "https://www.amazon.co.uk/SZJIAHTM-Drooling-Breathable-Adjustable-Teething/dp/B0BSC6B6QB",
        "image":
            "https://m.media-amazon.com/images/I/61SDo7b7izL.__AC_SY445_SX342_QL70_ML2_.jpg",
        "price": "£11",
        "selected": false,
    },
    {
        "id": 20,
        "title":
            "Tutti Bambini Baby Playpen - Foldable Playpen for Baby and Toddlers with Breathable Mesh Walls, Padded Frame, Zip Door & Fitted Playpen Mat, Baby Play Pen with Travel Bag (135 x 135 x 75 cm), Silver",
        "url":
            "https://www.amazon.co.uk/Tutti-Bambini-Baby-Playpen-Breathable/dp/B07ZZ35S2N",
        "image":
            "https://m.media-amazon.com/images/I/71Re+-jpB2L._AC_SY300_SX300_.jpg",
        "price": "£68",
        "selected": false,
    },
    {
        "id": 21,
        "title":
            "PandaEar Silicone Toy Straps for Baby- 5 Pack Dinosaur Baby Toy Safety Straps- Adjustable Pacifier Teether Holder Straps- Silicone Dummy Clips for Bottles, Strollers, High Chairs, Cribs",
        "url":
            "https://www.amazon.co.uk/PandaEar-Silicone-Dinosaur-Adjustable-Strollers/dp/B0C7G83BC4",
        "image":
            "https://m.media-amazon.com/images/I/6196DWreDML.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£7",
        "selected": false,
    },
    {
        "id": 22,
        "title":
            "2 Pack Teething Toys for Baby, Silicone Teether Teething Ring for Babies, BPA Free Baby Toys 0 3 6 12 Months, Teething Relief Chew Toys Nursing Accessories for Baby Boy Girl Toddler Infant",
        "url":
            "https://www.amazon.co.uk/Teething-Silicone-Teether-Nursing-Accessories/dp/B0D9JZYYGM",
        "image":
            "https://m.media-amazon.com/images/I/61+P7R5228L._AC_SY300_SX300_.jpg",
        "price": "£5",
        "selected": false,
    },
    {
        "id": 23,
        "title":
            "Baby Washcloths 100% Organic Bamboo Bath Washcloth Reusable Face Towels Anti-Bacterial Soft Towel Set Perfect for Newborn(5 Pack)",
        "url":
            "https://www.amazon.co.uk/Baby-Washcloths-Washcloth-Reusable-Anti-Bacterial/dp/B089QD6XYJ",
        "image":
            "https://m.media-amazon.com/images/I/51jBszLMKZL.__AC_SX300_SY300_QL70_ML2_.jpg",
        "price": "£9",
        "selected": false,
    },
];

// Load templates

// // Register product card as a partial

// Render wishlist
export function renderWishlist(products, selectedItems) {
    const wishlistTemplate = loadView("wishlists");

    // Sort products: Not selected first, then selected
    const sortedProducts = products.sort((a, b) => {
        const aSelected = selectedItems[a.id] || false;
        const bSelected = selectedItems[b.id] || false;
        return Number(aSelected) - Number(bSelected);
    });

    // Render the HTML with data
    return wishlistTemplate({ products: sortedProducts });
}

export default defineEventHandler(() => {
    return renderWishlist(products, selectedItems);
});

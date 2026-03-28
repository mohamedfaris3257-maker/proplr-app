import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Shop - Proplr',
  description: 'Official Proplr merchandise and products.',
};

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_aed: number;
  image_url: string | null;
  category: string | null;
}

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price_aed, image_url, category')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const items: Product[] = products ?? [];

  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#ffffff', padding: '160px 24px 60px' }}>
        <div className="max-w-[1100px] mx-auto text-center">
          <h1
            className="reveal"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: '#071629',
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            Proplr Shop
          </h1>
          <p
            className="reveal reveal-delay-1"
            style={{ color: '#6e6e73', fontSize: 18, maxWidth: 480, margin: '0 auto' }}
          >
            Official merchandise and products from the Proplr community.
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ background: '#f5f5f7', padding: '0 24px 80px' }}>
        <div className="max-w-[1100px] mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ color: '#6e6e73', fontSize: 16 }}>
                No products available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product, i) => (
                <div
                  key={product.id}
                  className={`reveal reveal-delay-${(i % 3) + 1}`}
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: '100%',
                      height: 220,
                      background: '#f5f5f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#c7c7cc"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px 24px 24px' }}>
                    {product.category && (
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#6e6e73',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: 8,
                        }}
                      >
                        {product.category}
                      </span>
                    )}
                    <h3
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 700,
                        fontSize: 18,
                        color: '#071629',
                        marginBottom: 6,
                      }}
                    >
                      {product.name}
                    </h3>
                    {product.description && (
                      <p
                        style={{
                          color: '#6e6e73',
                          fontSize: 14,
                          lineHeight: 1.6,
                          marginBottom: 16,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: product.description ? 0 : 16,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 800,
                          fontSize: 20,
                          color: '#071629',
                        }}
                      >
                        AED {Number(product.price_aed).toFixed(0)}
                      </span>
                      <div style={{ position: 'relative' }} className="group">
                        <button
                          disabled
                          style={{
                            padding: '10px 20px',
                            borderRadius: 10,
                            border: 'none',
                            background: '#e5e5ea',
                            color: '#8e8e93',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'not-allowed',
                          }}
                        >
                          Buy Now
                        </button>
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '110%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#071629',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 6,
                            whiteSpace: 'nowrap',
                            opacity: 0,
                            pointerEvents: 'none',
                            transition: 'opacity 0.2s',
                          }}
                          className="group-hover:!opacity-100"
                        >
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { Drawer, Button, List, Typography, Badge, Empty, ConfigProvider, theme as antTheme } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

export default function CartDrawer() {
    const { 
        cartItems, 
        isCartDrawerOpen, 
        setIsCartDrawerOpen, 
        removeFromCart, 
        updateQuantity, 
        getCartTotal 
    } = useCart();
    
    const navigate = useNavigate();

    const total = getCartTotal();

    const handleCheckout = () => {
        setIsCartDrawerOpen(false);
        // Implementar lógica de checkout después
        // navigate('/checkout'); 
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: antTheme.darkAlgorithm,
                token: {
                    colorPrimary: '#A68966',       
                    colorBgBase: '#151515',        
                    colorBgElevated: '#1a1a1b',
                    colorTextBase: '#F5F5F5',      
                    colorTextSecondary: '#D1D1D1', 
                    fontFamily: '"Poppins", sans-serif',
                }
            }}
        >
            <Drawer
                title={
                    <span className="font-serif text-valex-bronce text-xl tracking-widest flex items-center gap-3">
                        <ShoppingCartOutlined /> MI BOLSA ({cartItems.length})
                    </span>
                }
                placement="right"
                onClose={() => setIsCartDrawerOpen(false)}
                open={isCartDrawerOpen}
                width={400}
                styles={{ 
                    header: { borderBottom: '1px solid rgba(166,137,102,0.2)', backgroundColor: '#151515' }, 
                    body: { padding: '0', backgroundColor: '#1a1a1b', display: 'flex', flexDirection: 'column' } 
                }}
            >
                {cartItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<span className="text-valex-gris font-serif">Tu bolsa está vacía.</span>}
                        >
                            <Button 
                                type="primary" 
                                className="!bg-valex-bronce border-none !text-valex-negro tracking-wide mt-4"
                                onClick={() => { setIsCartDrawerOpen(false); navigate('/tienda'); }}
                            >
                                Descubrir Fragancias
                            </Button>
                        </Empty>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto w-full">
                            <List
                                itemLayout="horizontal"
                                dataSource={cartItems}
                                renderItem={(item) => (
                                    <List.Item 
                                        className="!border-b !border-valex-gris/10 p-4 transition-colors hover:bg-valex-gris/5"
                                        extra={
                                            <Button 
                                                type="text" 
                                                danger 
                                                icon={<DeleteOutlined />} 
                                                onClick={() => removeFromCart(item.id)}
                                            />
                                        }
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <div 
                                                    className="w-16 h-16 bg-[#151515] bg-center bg-contain bg-no-repeat border border-valex-gris/20 rounded"
                                                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                                                />
                                            }
                                            title={
                                                <span className="font-serif text-valex-hueso text-base">{item.name}</span>
                                            }
                                            description={
                                                <div className="flex flex-col gap-2 mt-1">
                                                    <Text className="text-valex-bronce font-medium">${Number(item.price).toFixed(2)}</Text>
                                                    <div className="flex items-center gap-3">
                                                        <Button 
                                                            size="small" 
                                                            icon={<MinusOutlined className="text-xs" />} 
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="bg-transparent border-valex-gris/30 text-valex-gris"
                                                        />
                                                        <Text className="text-valex-hueso">{item.quantity}</Text>
                                                        <Button 
                                                            size="small" 
                                                            icon={<PlusOutlined className="text-xs" />} 
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="bg-transparent border-valex-gris/30 text-valex-gris"
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>

                        {/* Order Summary Footer */}
                        <div className="border-t border-valex-bronce/20 p-6 bg-[#151515]">
                            <div className="flex justify-between items-center mb-6">
                                <Text className="font-serif text-valex-gris uppercase tracking-widest">Total Estimado</Text>
                                <Title level={3} className="!text-valex-bronce !mb-0 !font-sans font-medium">
                                    ${total.toFixed(2)}
                                </Title>
                            </div>
                            <Button 
                                type="primary" 
                                block 
                                size="large"
                                icon={<CreditCardOutlined />}
                                onClick={handleCheckout}
                                className="!h-14 !text-base font-serif tracking-widest uppercase !bg-valex-bronce hover:!bg-valex-bronce-light border-none shadow-[0_0_15px_rgba(166,137,102,0.3)]"
                            >
                                Proceder al Pago
                            </Button>
                        </div>
                    </>
                )}
            </Drawer>
        </ConfigProvider>
    );
}

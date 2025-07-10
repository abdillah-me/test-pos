/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const App = () => {
    // dibuat 2 input 1 harga 1 jumlah ada tombol harga * jumlah
    const [name, setName] = useState<string>("");
    const [harga, setHarga] = useState<number>(0);
    const [jumlah, setJumlah] = useState<number>(0);

    const [cart, setCart] = useState<any[]>([]);
    console.log("🚀 ~ App ~ cart:", cart);
    const [grandTotal, setGrandTotal] = useState({
        totalItem: 0,
        totalBayar: 0,
    });

    // lakukan pengecekan jika nama barang sama, maka akan menambahkan item, jika input yg dimasukkan berbeda, akan menampilkan error
    const handleSameProduct = () => {
        const sameProductName = cart.find(
            (item) => item.name.toLowerCase() === name.toLowerCase()
        );
        const samePrice = cart.find((item) => item.harga === harga);

        if (sameProductName && !samePrice) {
            return alert("Nama sama tapi harga tidak sama");
        }

        return sameProductName;
    };

    const handlePerkalian = () => {
        // handle result harus kelipatan 5000
        if (harga % 5000 !== 0) {
            return alert("Harga harus kelipatan 5000");
        }
        const result = Number(harga) * Number(jumlah);

        return result;
    };

    // ketika tombol di klik masuk ke cart
    // example : apple 5 biji menjadi 10K
    const handleCart = () => {
        const resultSum = handlePerkalian();
        const checkSameProduct = handleSameProduct();
        const indexProduct = cart.findIndex((item) => item.name === name);
        try {
            if (checkSameProduct) {
                const newCart = [...cart];
                newCart[indexProduct].jumlah += jumlah;
                newCart[indexProduct].result += resultSum;
                setCart(newCart);
                return;
            }
            const data = {
                name,
                harga,
                jumlah,
                result: resultSum,
            };
            setCart([...cart, data]);
        } catch (error) {
            console.log("🚀 ~ handleCart ~ error:", error);
        } finally {
            setName("");
            setHarga(5000);
            setJumlah(0);
        }
    };

    // buat grand total, total item dan yg harus dibayarkan
    useEffect(() => {
        let totalItem = 0;
        let totalBayar = 0;
        cart.forEach((item) => {
            totalItem += item.jumlah;
            totalBayar += item.result;
        });
        setGrandTotal({
            totalItem,
            totalBayar,
        });
    }, [cart]);

    // table di buat tombol hapus hapus
    const handleDeleteCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    function formatRupiah(value: number): string {
        return `Rp. ${value?.toLocaleString("id-ID")}`;
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold py-5  w-full text-center border-b mb-7">
                POS Cart
            </h1>
            <div className="flex gap-14 items-start p-4 justify-between w-full">
                {/* nama barang */}
                <div className="flex flex-col gap-3 w-[25%] bg-white shadow-md px-4 py-6">
                    <label className="font-semibold" htmlFor="">
                        Nama Barang
                    </label>
                    <input
                        value={name}
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        className="border border-black rounded-md px-2 py-2"
                    />

                    <label className="font-semibold" htmlFor="">
                        Harga
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                            Rp
                        </span>
                        <input
                            type="number"
                            value={harga}
                            onChange={(e) => setHarga(Number(e.target.value))}
                            className="pl-10 pr-2 py-2 border border-black rounded-md w-full"
                            placeholder="harga kelipatan 5000"
                        />
                    </div>
                    <span className="-mt-3 text-[10px] text-red-600">
                        *harga kelipatan 5.000
                    </span>

                    <label className="font-semibold" htmlFor="">
                        Jumlah
                    </label>
                    <input
                        value={jumlah}
                        onChange={(e) => setJumlah(Number(e.target.value))}
                        type="number"
                        className="border border-black rounded-md px-2 py-2"
                    />
                    <button
                        className={`${
                            name === "" || harga === 0 || jumlah === 0
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        } text-white font-bold py-2 px-4 rounded transition`}
                        onClick={handleCart}
                        disabled={name === "" || harga === 0 || jumlah === 0}
                    >
                        Add to Cart
                    </button>

                    {/* table cart */}
                </div>
                <div className="w-[50%]">
                    <table className="w-full border border-gray-300 rounded-md shadow overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Nama Barang
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Harga
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Jumlah
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Hasil
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-4 text-gray-200"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                            {cart.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2 text-sm text-gray-800 capitalize">
                                        {item.name}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {formatRupiah(item.harga)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {item.jumlah}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {formatRupiah(item.result)}
                                    </td>
                                    <td className="px-4 py-2 ">
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() =>
                                                handleDeleteCart(index)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* grand total */}
                <div className="w-[25%] bg-green-800 text-white p-4 rounded-xl">
                    <p>Total Item: </p>
                    <p className="font-black">{grandTotal.totalItem}</p>
                    <hr className="my-4 border-gray-200" />
                    <p>Grand Total:</p>
                    <p className="font-black">
                        {formatRupiah(grandTotal.totalBayar)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;

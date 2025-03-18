export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            currentPage: number;  // Trang hiện tại
            pageSize: number;     // Số item tối đa trên mỗi trang
            totalPages: number;   // Tổng số trang
            totalItems: number;   // Tổng số item trong database
        },
        items: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            role: string;
            avatar: string;
        }

    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IFetchAccount {
        user: IUser
    }

    interface IUserTable {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IResponseImport {
        countSuccess: number;
        countError: number;
        detail: any;
    }

    interface IBookTable {
        id: string;
        promotion: number
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        supplier: ISupplierDto
    }
    interface ISupplierDto {
        id: number;
        name: string;
        logo: string
    }

    interface ICart {
        _id: string;
        quantity: number;
        detail: IBookTable;
    }

    interface IHistory {
        _id: string;
        name: string;
        type: string;
        email: string;
        phone: string;
        userId: string;
        detail:
        {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        paymentStatus: string;
        paymentRef: string;
    }

    interface IOrderTable extends IHistory {

    }








    interface ISupplier {
        id: string;
        name: string,
        contactInfo: string,
        createdAt: Date;
        updatedAt: Date;

    }


    interface IBrands {

        id: string;
        name: string,
        logo: string,
        createdAt: Date;
        updatedAt: Date;


    }





    interface ICategory {
        id: string;
        name: string
        url: string
    }



}


import { Button } from 'antd';
import React, { useState } from 'react';

const ExpandableDescription = () => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="product-description">
            <h3>Mô tả sản phẩm</h3>
            <p>
                Trong cuộc chiến thu hút khách hàng, các doanh nghiệp đầu tư hàng triệu đô la để
                cải thiện trải nghiệm của khách hàng. Họ giao hàng nhanh hơn, tung ra các sản
                phẩm mới và không ngừng cải tiến giao diện người dùng, và họ thường gây áp lực
                lớn hơn cho nhân viên vì lợi nhuận giảm dần. Theo tác giả Tiffani Bova, việc tập
                trung duy nhất vào trải nghiệm của khách hàng – mà không xem xét tác động đến
                nhân viên của bạn – thực sự cản trở sự phát triển về lâu dài. Các công ty thành
                công nhất áp dụng Tư duy trải nghiệm để củng cố cả trải nghiệm của nhân viên
                (EX) và trải nghiệm của khách hàng (CX) cùng một lúc.
            </p>

            {expanded && (
                <div className="expanded-content">
                    <p>
                        Dựa trên nghiên cứu độc quyền từ hai nghiên cứu do Salesforce tài trợ với hàng nghìn nhân viên và giám đốc điều hành cấp cao, cuốn sách "Dẫn dắt một bầy sói hay chăn một đàn cừu" trình bày chi tiết chính xác cách công ty của bạn có thể áp dụng tư duy trải nghiệm trên quy mô lớn. Dù bạn đang làm quản lý, khởi nghiệp, hay quản lý cấp cao, cuốn sách sẽ giúp bạn sử dụng và giữ chân những nhân viên tài năng nhất, khiến họ toàn tâm, toàn ý với sứ mệnh của bạn, thu hút khách hàng nhiều hơn trước. Nhân viên là trái tim của doanh nghiệp bạn. Nếu bạn muốn duy trì khả năng cạnh tranh trên thị trường ngày nay, đầu tư vào con người không còn là điều nên có nữa mà là điều bắt buộc phải có. Sau khi đọc cuốn sách này, bạn sẽ trang bị cho mình một câu trả lời thỏa đáng cho câu hỏi "Nên đặt-nhân-viên hay khách-hàng lên trước"?
                    </p>

                    <p>
                        <strong>Một đánh giá về cuốn sách:</strong><br />
                        "Một cuốn sách thiết thực và khai sáng, cho bạn những công cụ hàng ngày, bổ sung mảnh ghép còn thiếu trong bức tranh tăng trưởng phức tạp, đó là: cải thiện trải nghiệm nhân viên."<br />
                        <em>- Arianna Huffington, người sáng lập và CEO của Thrive Global</em>
                    </p>

                    <p>
                        "Nếu bạn đang điều hành hay làm việc cho công ty nào đó thì cần đọc cuốn sách này. Nghiên cứu của Tiffani Bova trả lời một số câu hỏi cấp bách nhất hiện nay, tại sao thị trường lao động quá nhiều rối loạn, tại sao khách hàng không phải lúc nào cũng đúng, và tại sao công nghệ không phải lúc nào cũng giúp ích nhân viên."<br />
                        <em>- Rita McGrath, tác giả cuốn Seeing Around Corners và là giáo sư của trường Kinh doanh Columbia (Columbia Business School)</em>
                    </p>

                    <p>
                        "Điểm chung của những công ty thành công nhất trên thế giới? Đó là họ kết hợp hài hòa trải nghiệm nhân viên với trải nghiệm khách hàng. Cuốn sách này cho bạn thấy những trải nghiệm tưởng chừng khác biệt này liên kết với nhau thế nào và thay đổi công ty bạn với tư duy-hướng-đến-tăng-trưởng đó là: Tư duy Trải nghiệm."<br />
                        <em>- Deanna Singh, tác giả cuốn Actions Speak Louder, và là nhà tư vấn thay đổi chính của Flying Elephant</em>
                    </p>

                    <p>
                        <strong>Về tác giả</strong><br />
                        Tiffani Bova là người truyền bá tư tưởng phát triển khách hàng toàn cầu và đột phá sáng tạo tại Salesforce. Trong hơn 20 năm qua, cô đã dẫn dắt nhiều phòng, ban tạo doanh thu tại rất nhiều doanh nghiệp, từ tân binh khởi nghiệp đến những "lão làng" trong danh sách Fortune 500.
                    </p>

                    <p>
                        Cô đã có 10 năm làm việc tại Gartner, công ty nghiên cứu và cố vấn IT hàng đầu thế giới, với tư cách một chuyên gia phân tích và nghiên cứu viên ưu tú. Những quan điểm độc đáo của cô đã giúp Microsoft, Cisco, Hewlett-Packard, IBM, Oracle, SAP, AT&T, Dell, Amazon-AWS và nhiều công ty xuất sắc khác mở rộng thị phần và tăng doanh thu.
                    </p>

                    <p className="note">
                        Giá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....
                    </p>
                </div>
            )}

            <Button
                type='text'
                className="toggle-button"
                style={{
                    textDecoration: 'underline'

                }}
                onClick={toggleExpanded}
            >
                {expanded ? 'Thu gọn' : 'Xem thêm'}
            </Button>
        </div>
    );
};

export default ExpandableDescription;
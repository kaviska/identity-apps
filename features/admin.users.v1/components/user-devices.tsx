/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useGetDevicesByUserId from "@wso2is/admin.devices.v1/hooks/use-get-devices-by-user-id";
import { DeviceResponseInterface } from "@wso2is/admin.devices.v1/models/devices";
import { AlertLevels, IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ContentLoader,
    DataTable,
    EmptyPlaceholder,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Header, Label, Pagination, PaginationProps, SemanticICONS } from "semantic-ui-react";

const DEFAULT_LIMIT: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT;

interface UserDevicesPropsInterface extends IdentifiableComponentInterface {
    user: ProfileInfoInterface;
}

const UserDevices: FunctionComponent<UserDevicesPropsInterface> = ({
    user,
    "data-componentid": componentId = "user-devices"
}: UserDevicesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ offset, setOffset ] = useState<number>(0);

    const {
        data,
        isLoading,
        error
    } = useGetDevicesByUserId(user?.id, DEFAULT_LIMIT, offset, !!user?.id);

    const devices: DeviceResponseInterface[] = data?.devices ?? [];
    const totalResults: number = data?.totalResults ?? 0;
    const totalPages: number = Math.ceil(totalResults / DEFAULT_LIMIT);
    const activePage: number = Math.floor(offset / DEFAULT_LIMIT) + 1;

    useEffect((): void => {
        if (!error) {
            return;
        }

        dispatch(addAlert({
            description: t("users:userDevices.notifications.fetch.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("users:userDevices.notifications.fetch.genericError.message")
        }));
    }, [ error ]);

    const handlePageChange = (_e: MouseEvent<HTMLAnchorElement>, paginationData: PaginationProps): void => {
        setOffset(((paginationData.activePage as number) - 1) * DEFAULT_LIMIT);
    };

    const resolveStatusLabel = (status: string): ReactElement => {
        const colour: "green" | "yellow" | "red" =
            status === "ACTIVE" ? "green" : status === "PENDING" ? "yellow" : "red";

        return (
            <Label color={ colour } size="small">{ status }</Label>
        );
    };

    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "deviceName",
            id: "deviceName",
            key: "deviceName",
            render: (device: DeviceResponseInterface): ReactNode => (
                <Header
                    image
                    as="h6"
                    className="header-with-icon"
                    data-componentid={ `${ componentId }-item-heading` }
                >
                    <AppAvatar
                        image={ (
                            <AnimatedAvatar
                                name={ device.deviceName ?? "Device" }
                                size="mini"
                                data-componentid={ `${ componentId }-item-avatar` }
                            />
                        ) }
                        size="mini"
                        spaced="right"
                        data-componentid={ `${ componentId }-item-image` }
                    />
                    <Header.Content>
                        { device.deviceName }
                        <Header.Subheader>{ device.deviceModel }</Header.Subheader>
                    </Header.Content>
                </Header>
            ),
            title: t("users:userDevices.list.columns.deviceName")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "status",
            id: "status",
            key: "status",
            render: (device: DeviceResponseInterface): ReactNode => resolveStatusLabel(device.status),
            title: t("users:userDevices.list.columns.status")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "registeredAt",
            id: "registeredAt",
            key: "registeredAt",
            render: (device: DeviceResponseInterface): ReactNode =>
                device.registeredAt ? new Date(device.registeredAt).toLocaleDateString() : "-",
            title: t("users:userDevices.list.columns.registeredAt")
        }
    ];

    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${ componentId }-item-view-button`,
            hidden: (): boolean => false,
            icon: (): SemanticICONS => "eye",
            onClick: (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
                history.push(
                    AppConstants.getPaths().get("DEVICE_DETAIL").replace(":id", device.id)
                );
            },
            popupText: (): string => t("common:view"),
            renderer: "semantic-icon"
        }
    ];

    if (isLoading && devices.length === 0) {
        return <ContentLoader />;
    }

    return (
        <>
            <DataTable<DeviceResponseInterface>
                className="user-devices-table"
                isLoading={ isLoading }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ devices }
                placeholders={
                    <EmptyPlaceholder
                        className="list-placeholder mr-0"
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        subtitle={ [ t("users:userDevices.placeholders.empty.subtitles.0") ] }
                        title={ t("users:userDevices.placeholders.empty.title") }
                        data-componentid={ `${ componentId }-empty-placeholder` }
                    />
                }
                selectable={ true }
                onRowClick={ (_e: SyntheticEvent, device: DeviceResponseInterface): void => {
                    history.push(
                        AppConstants.getPaths().get("DEVICE_DETAIL").replace(":id", device.id)
                    );
                } }
                showHeader={ true }
                transparent={ !isLoading && devices.length === 0 }
                data-componentid={ componentId }
            />
            { totalPages > 1 && (
                <Pagination
                    activePage={ activePage }
                    totalPages={ totalPages }
                    onPageChange={ handlePageChange }
                    floated="right"
                    data-componentid={ `${ componentId }-pagination` }
                />
            ) }
        </>
    );
};

export default UserDevices;

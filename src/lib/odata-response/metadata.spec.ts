import { CsdlTypeDefinition } from './csdl/csdl-type-definition';
import { Metadata } from './metadata';
import { CsdlSchema } from './csdl/csdl-schema';
import { CsdlEnumType, CsdlEnumMember } from './csdl/csdl-enum-type';
import { CsdlEntityType, CsdlKey, CsdlPropertyRef, CsdlComplexType } from './csdl/csdl-structured-type';
import { CsdlProperty, CsdlNavigationProperty, CsdlReferentialConstraint, CsdlOnDelete } from './csdl/csdl-structural-property';
import { CsdlFunction, CsdlReturnType, CsdlParameter, CsdlFunctionImport, CsdlActionImport, CsdlAction } from './csdl/csdl-function-action';
import { CsdlEntityContainer } from './csdl/csdl-entity-container';
import { CsdlEntitySet } from './csdl/csdl-entity-set';
import { CsdlSingleton } from './csdl/csdl-singleton';
import { CsdlReference, CsdlInclude, CsdlIncludeAnnotations } from './csdl/csdl-reference';
import { CsdlAnnotation, CsdlTerm, CsdlAnnotations } from './csdl/csdl-annotation';
import { CsdlNavigationPropertyBinding } from './csdl/csdl-navigation-property-binding';

export const XML_EXAMPLE = '<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx"><edmx:DataServices><Schema Namespace="Microsoft.OData.SampleService.Models.TripPin" xmlns="http://docs.oasis-open.org/odata/ns/edm"><EnumType Name="PersonGender"><Member Name="Male" Value="0" /><Member Name="Female" Value="1" /><Member Name="Unknown" Value="2" /></EnumType><ComplexType Name="City"><Property Name="CountryRegion" Type="Edm.String" Nullable="false" /><Property Name="Name" Type="Edm.String" Nullable="false" /><Property Name="Region" Type="Edm.String" Nullable="false" /></ComplexType><ComplexType Name="Location" OpenType="true"><Property Name="Address" Type="Edm.String" Nullable="false" /><Property Name="City" Type="Microsoft.OData.SampleService.Models.TripPin.City" Nullable="false" /></ComplexType><ComplexType Name="EventLocation" BaseType="Microsoft.OData.SampleService.Models.TripPin.Location" OpenType="true"><Property Name="BuildingInfo" Type="Edm.String" /></ComplexType><ComplexType Name="AirportLocation" BaseType="Microsoft.OData.SampleService.Models.TripPin.Location" OpenType="true"><Property Name="Loc" Type="Edm.GeographyPoint" Nullable="false" SRID="4326" /></ComplexType><EntityType Name="Photo" HasStream="true"><Key><PropertyRef Name="Id" /></Key><Property Name="Id" Type="Edm.Int64" Nullable="false"><Annotation Term="Org.OData.Core.V1.Permissions"><EnumMember>Org.OData.Core.V1.Permission/Read</EnumMember></Annotation></Property><Property Name="Name" Type="Edm.String" /><Annotation Term="Org.OData.Core.V1.AcceptableMediaTypes"><Collection><String>image/jpeg</String></Collection></Annotation></EntityType><EntityType Name="Person" OpenType="true"><Key><PropertyRef Name="UserName" /></Key><Property Name="UserName" Type="Edm.String" Nullable="false"><Annotation Term="Org.OData.Core.V1.Permissions"><EnumMember>Org.OData.Core.V1.Permission/Read</EnumMember></Annotation></Property><Property Name="FirstName" Type="Edm.String" Nullable="false" /><Property Name="LastName" Type="Edm.String" Nullable="false" /><Property Name="Emails" Type="Collection(Edm.String)" /><Property Name="AddressInfo" Type="Collection(Microsoft.OData.SampleService.Models.TripPin.Location)" /><Property Name="Gender" Type="Microsoft.OData.SampleService.Models.TripPin.PersonGender" /><Property Name="Concurrency" Type="Edm.Int64" Nullable="false"><Annotation Term="Org.OData.Core.V1.Computed" Bool="true" /></Property><NavigationProperty Name="Friends" Type="Collection(Microsoft.OData.SampleService.Models.TripPin.Person)" /><NavigationProperty Name="Trips" Type="Collection(Microsoft.OData.SampleService.Models.TripPin.Trip)" ContainsTarget="true" /><NavigationProperty Name="Photo" Type="Microsoft.OData.SampleService.Models.TripPin.Photo" /></EntityType><EntityType Name="Airline"><Key><PropertyRef Name="AirlineCode" /></Key><Property Name="AirlineCode" Type="Edm.String" Nullable="false"><Annotation Term="Org.OData.Core.V1.Permissions"><EnumMember>Org.OData.Core.V1.Permission/Read</EnumMember></Annotation></Property><Property Name="Name" Type="Edm.String" Nullable="false" /></EntityType><EntityType Name="Airport"><Key><PropertyRef Name="IcaoCode" /></Key><Property Name="IcaoCode" Type="Edm.String" Nullable="false"><Annotation Term="Org.OData.Core.V1.Permissions"><EnumMember>Org.OData.Core.V1.Permission/Read</EnumMember></Annotation></Property><Property Name="Name" Type="Edm.String" Nullable="false" /><Property Name="IataCode" Type="Edm.String" Nullable="false"><Annotation Term="Org.OData.Core.V1.Immutable" Bool="true" /></Property><Property Name="Location" Type="Microsoft.OData.SampleService.Models.TripPin.AirportLocation" Nullable="false" /></EntityType><EntityType Name="PlanItem"><Key><PropertyRef Name="PlanItemId" /></Key><Property Name="PlanItemId" Type="Edm.Int32" Nullable="false"><Annotation Term="Org.OData.Core.V1.Permissions"><EnumMember>Org.OData.Core.V1.Permission/Read</EnumMember></Annotation></Property><Property Name="ConfirmationCode" Type="Edm.String" /><Property Name="StartsAt" Type="Edm.DateTimeOffset" /><Property Name="EndsAt" Type="Edm.DateTimeOffset" /><Property Name="Duration" Type="Edm.Duration" /></EntityType><EntityType Name="PublicTransportation" BaseType="Microsoft.OData.SampleService.Models.TripPin.PlanItem"><Property Name="SeatNumber" Type="Edm.String" /></EntityType><EntityType Name="Flight" BaseType="Microsoft.OData.SampleService.Models.TripPin.PublicTransportation"><Property Name="FlightNumber" Type="Edm.String" Nullable="false" /><NavigationProperty Name="From" Type="Microsoft.OData.SampleService.Models.TripPin.Airport" Nullable="false" /><NavigationProperty Name="To" Type="Microsoft.OData.SampleService.Models.TripPin.Airport" Nullable="false" /><NavigationProperty Name="Airline" Type="Microsoft.OData.SampleService.Models.TripPin.Airline" Nullable="false" /></EntityType><EntityType Name="Event" BaseType="Microsoft.OData.SampleService.Models.TripPin.PlanItem" OpenType="true"><Property Name="Description" Type="Edm.String" /><Property Name="OccursAt" Type="Microsoft.OData.SampleService.Models.TripPin.EventLocation" Nullable="false" /></EntityType><EntityType Name="Trip"><Key><PropertyRef Name="TripId" /></Key><Property Name="TripId" Type="Edm.Int32" Nullable="false"><Annotation Term="Org.OData.Core.V1.Permissions"><EnumMember>Org.OData.Core.V1.Permission/Read</EnumMember></Annotation></Property><Property Name="ShareId" Type="Edm.Guid" /><Property Name="Description" Type="Edm.String" /><Property Name="Name" Type="Edm.String" Nullable="false" /><Property Name="Budget" Type="Edm.Single" Nullable="false"><Annotation Term="Org.OData.Measures.V1.ISOCurrency" String="USD" /><Annotation Term="Org.OData.Measures.V1.Scale" Int="2" /></Property><Property Name="StartsAt" Type="Edm.DateTimeOffset" Nullable="false" /><Property Name="EndsAt" Type="Edm.DateTimeOffset" Nullable="false" /><Property Name="Tags" Type="Collection(Edm.String)" Nullable="false" /><NavigationProperty Name="Photos" Type="Collection(Microsoft.OData.SampleService.Models.TripPin.Photo)" /><NavigationProperty Name="PlanItems" Type="Collection(Microsoft.OData.SampleService.Models.TripPin.PlanItem)" ContainsTarget="true" /></EntityType><Function Name="GetFavoriteAirline" IsBound="true" EntitySetPath="person/Trips/PlanItems/Microsoft.OData.SampleService.Models.TripPin.Flight/Airline" IsComposable="true"><Parameter Name="person" Type="Microsoft.OData.SampleService.Models.TripPin.Person" Nullable="false" /><ReturnType Type="Microsoft.OData.SampleService.Models.TripPin.Airline" Nullable="false" /></Function><Function Name="GetInvolvedPeople" IsBound="true" IsComposable="true"><Parameter Name="trip" Type="Microsoft.OData.SampleService.Models.TripPin.Trip" Nullable="false" /><ReturnType Type="Collection(Microsoft.OData.SampleService.Models.TripPin.Person)" Nullable="false" /></Function><Function Name="GetFriendsTrips" IsBound="true" EntitySetPath="person/Friends/Trips" IsComposable="true"><Parameter Name="person" Type="Microsoft.OData.SampleService.Models.TripPin.Person" Nullable="false" /><Parameter Name="userName" Type="Edm.String" Nullable="false" /><ReturnType Type="Collection(Microsoft.OData.SampleService.Models.TripPin.Trip)" Nullable="false" /></Function><Function Name="GetNearestAirport" IsComposable="true"><Parameter Name="lat" Type="Edm.Double" Nullable="false" /><Parameter Name="lon" Type="Edm.Double" Nullable="false" /><ReturnType Type="Microsoft.OData.SampleService.Models.TripPin.Airport" Nullable="false" /></Function><Action Name="ResetDataSource" /><Action Name="ShareTrip" IsBound="true"><Parameter Name="person" Type="Microsoft.OData.SampleService.Models.TripPin.Person" Nullable="false" /><Parameter Name="userName" Type="Edm.String" Nullable="false" /><Parameter Name="tripId" Type="Edm.Int32" Nullable="false" /></Action><EntityContainer Name="DefaultContainer"><EntitySet Name="Photos" EntityType="Microsoft.OData.SampleService.Models.TripPin.Photo"><Annotation Term="Org.OData.Core.V1.ResourcePath" String="Photos" /><Annotation Term="Org.OData.Capabilities.V1.SearchRestrictions"><Record><PropertyValue Property="Searchable" Bool="true" /><PropertyValue Property="UnsupportedExpressions"><EnumMember>Org.OData.Capabilities.V1.SearchExpressions/none</EnumMember></PropertyValue></Record></Annotation><Annotation Term="Org.OData.Capabilities.V1.InsertRestrictions"><Record><PropertyValue Property="Insertable" Bool="true" /><PropertyValue Property="NonInsertableNavigationProperties"><Collection /></PropertyValue></Record></Annotation></EntitySet><EntitySet Name="People" EntityType="Microsoft.OData.SampleService.Models.TripPin.Person"><NavigationPropertyBinding Path="Friends" Target="People" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Flight/Airline" Target="Airlines" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Flight/From" Target="Airports" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Flight/To" Target="Airports" /><NavigationPropertyBinding Path="Photo" Target="Photos" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Trip/Photos" Target="Photos" /><Annotation Term="Org.OData.Core.V1.OptimisticConcurrency"><Collection><PropertyPath>Concurrency</PropertyPath></Collection></Annotation><Annotation Term="Org.OData.Core.V1.ResourcePath" String="People" /><Annotation Term="Org.OData.Capabilities.V1.NavigationRestrictions"><Record><PropertyValue Property="Navigability"><EnumMember>Org.OData.Capabilities.V1.NavigationType/None</EnumMember></PropertyValue><PropertyValue Property="RestrictedProperties"><Collection><Record><PropertyValue Property="NavigationProperty" NavigationPropertyPath="Friends" /><PropertyValue Property="Navigability"><EnumMember>Org.OData.Capabilities.V1.NavigationType/Recursive</EnumMember></PropertyValue></Record></Collection></PropertyValue></Record></Annotation><Annotation Term="Org.OData.Capabilities.V1.SearchRestrictions"><Record><PropertyValue Property="Searchable" Bool="true" /><PropertyValue Property="UnsupportedExpressions"><EnumMember>Org.OData.Capabilities.V1.SearchExpressions/none</EnumMember></PropertyValue></Record></Annotation><Annotation Term="Org.OData.Capabilities.V1.InsertRestrictions"><Record><PropertyValue Property="Insertable" Bool="true" /><PropertyValue Property="NonInsertableNavigationProperties"><Collection><NavigationPropertyPath>Trips</NavigationPropertyPath><NavigationPropertyPath>Friends</NavigationPropertyPath></Collection></PropertyValue></Record></Annotation></EntitySet><EntitySet Name="Airlines" EntityType="Microsoft.OData.SampleService.Models.TripPin.Airline"><Annotation Term="Org.OData.Core.V1.ResourcePath" String="Airlines" /><Annotation Term="Org.OData.Capabilities.V1.SearchRestrictions"><Record><PropertyValue Property="Searchable" Bool="true" /><PropertyValue Property="UnsupportedExpressions"><EnumMember>Org.OData.Capabilities.V1.SearchExpressions/none</EnumMember></PropertyValue></Record></Annotation><Annotation Term="Org.OData.Capabilities.V1.InsertRestrictions"><Record><PropertyValue Property="Insertable" Bool="true" /><PropertyValue Property="NonInsertableNavigationProperties"><Collection /></PropertyValue></Record></Annotation></EntitySet><EntitySet Name="Airports" EntityType="Microsoft.OData.SampleService.Models.TripPin.Airport"><Annotation Term="Org.OData.Core.V1.ResourcePath" String="Airports" /><Annotation Term="Org.OData.Capabilities.V1.SearchRestrictions"><Record><PropertyValue Property="Searchable" Bool="true" /><PropertyValue Property="UnsupportedExpressions"><EnumMember>Org.OData.Capabilities.V1.SearchExpressions/none</EnumMember></PropertyValue></Record></Annotation><Annotation Term="Org.OData.Capabilities.V1.InsertRestrictions"><Record><PropertyValue Property="Insertable" Bool="false" /><PropertyValue Property="NonInsertableNavigationProperties"><Collection /></PropertyValue></Record></Annotation><Annotation Term="Org.OData.Capabilities.V1.DeleteRestrictions"><Record><PropertyValue Property="Deletable" Bool="false" /><PropertyValue Property="NonDeletableNavigationProperties"><Collection /></PropertyValue></Record></Annotation></EntitySet><Singleton Name="Me" Type="Microsoft.OData.SampleService.Models.TripPin.Person"><NavigationPropertyBinding Path="Friends" Target="People" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Flight/Airline" Target="Airlines" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Flight/From" Target="Airports" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Flight/To" Target="Airports" /><NavigationPropertyBinding Path="Photo" Target="Photos" /><NavigationPropertyBinding Path="Microsoft.OData.SampleService.Models.TripPin.Trip/Photos" Target="Photos" /><Annotation Term="Org.OData.Core.V1.ResourcePath" String="Me" /></Singleton><FunctionImport Name="GetNearestAirport" Function="Microsoft.OData.SampleService.Models.TripPin.GetNearestAirport" EntitySet="Airports" IncludeInServiceDocument="true"><Annotation Term="Org.OData.Core.V1.ResourcePath" String="Microsoft.OData.SampleService.Models.TripPin.GetNearestAirport" /></FunctionImport><ActionImport Name="ResetDataSource" Action="Microsoft.OData.SampleService.Models.TripPin.ResetDataSource" /><Annotation Term="Org.OData.Core.V1.Description" String="TripPin service is a sample service for OData V4." /></EntityContainer><Annotations Target="Microsoft.OData.SampleService.Models.TripPin.DefaultContainer"><Annotation Term="Org.OData.Core.V1.DereferenceableIDs" Bool="true" /><Annotation Term="Org.OData.Core.V1.ConventionalIDs" Bool="true" /><Annotation Term="Org.OData.Capabilities.V1.ConformanceLevel"><EnumMember>Org.OData.Capabilities.V1.ConformanceLevelType/Advanced</EnumMember></Annotation><Annotation Term="Org.OData.Capabilities.V1.SupportedFormats"><Collection><String>application/json;odata.metadata=full;IEEE754Compatible=false;odata.streaming=true</String><String>application/json;odata.metadata=minimal;IEEE754Compatible=false;odata.streaming=true</String><String>application/json;odata.metadata=none;IEEE754Compatible=false;odata.streaming=true</String></Collection></Annotation><Annotation Term="Org.OData.Capabilities.V1.AsynchronousRequestsSupported" Bool="true" /><Annotation Term="Org.OData.Capabilities.V1.BatchContinueOnErrorSupported" Bool="false" /><Annotation Term="Org.OData.Capabilities.V1.FilterFunctions"><Collection><String>contains</String><String>endswith</String><String>startswith</String><String>length</String><String>indexof</String><String>substring</String><String>tolower</String><String>toupper</String><String>trim</String><String>concat</String><String>year</String><String>month</String><String>day</String><String>hour</String><String>minute</String><String>second</String><String>round</String><String>floor</String><String>ceiling</String><String>cast</String><String>isof</String></Collection></Annotation></Annotations></Schema></edmx:DataServices></edmx:Edmx>';

describe('Metadata', () => {
    it('test version', () => {
        let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
        </edmx:Edmx>`;
        expect(() => new Metadata(xml)).toThrowError('Unable to parse metadata, Error: OData version is not specified in the metadata');

        xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="3.0">
        </edmx:Edmx>`;
        expect(() => new Metadata(xml)).toThrowError('Unable to parse metadata, Error: OData version "3.0" is not supported');

        xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
        <edmx:DataServices>
        <Schema>
            <EntityContainer></EntityContainer>
        </Schema>
      </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        expect(m.version).toEqual('4.0');
    });

    it('test references', () => {
        const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:Reference Uri="uri">
            <edmx:Include Namespace="namespace"/>
            <edmx:Include Namespace="namespace" Alias="alias"/>
            <edmx:IncludeAnnotations TermNamespace="termNamespace"/>
            <edmx:IncludeAnnotations TermNamespace="termNamespace" Qualifier="qualifier"/>
            <edmx:IncludeAnnotations TermNamespace="termNamespace" Qualifier="qualifier" TargetNamespace="targetNamespace"/>
            <Annotation Term="term" Qualifier="qualifier" />
          </edmx:Reference>
          <edmx:DataServices>
            <Schema>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        expect(m.references).toEqual([
            new CsdlReference('uri',
                [
                    new CsdlInclude('namespace'),
                    new CsdlInclude('namespace', 'alias')
                ], [
                    new CsdlIncludeAnnotations('termNamespace'),
                    new CsdlIncludeAnnotations('termNamespace', 'qualifier'),
                    new CsdlIncludeAnnotations('termNamespace', 'qualifier', 'targetNamespace')
                ], [
                    new CsdlAnnotation('term', 'qualifier')
                ])

        ]);
    });

    it('test schema attributes', () => {
        let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        let m: Metadata = new Metadata(xml);
        let schema: CsdlSchema = m.schemas[0];
        expect(schema.namespace).toEqual('namespace');

        xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace" Alias="alias">
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;

        m = new Metadata(xml);
        schema = m.schemas[0];
        expect(schema.namespace).toEqual('namespace');
        expect(schema.alias).toEqual('alias');
    });

    it('test properties', () => {
        let xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityType Name="name">
                    <Property Name="name" Type="Edm.String"/>
                    <Property Name="name" Type="Edm.String" Nullable="true" MaxLength="1" Precision="2" Scale="3" Unicode="false" SRID="4" DefaultValue="defaultValue"/>
                </EntityType>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        let m: Metadata = new Metadata(xml);
        let schema: CsdlSchema = m.schemas[0];
        expect(schema.entityTypes).toEqual([
            new CsdlEntityType('name', undefined, [
                new CsdlProperty('name', 'Edm.String'),
                new CsdlProperty('name', 'Edm.String', true, 1, 2, 3, false, '4', 'defaultValue')
            ])
        ]);

        xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace" Alias="alias">
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;

        m = new Metadata(xml);
        schema = m.schemas[0];
        expect(schema.namespace).toEqual('namespace');
        expect(schema.alias).toEqual('alias');
    });

    it('test navigation properties', () => {
        let xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityType Name="name">
                    <NavigationProperty Name="name" Type="type"/>
                    <NavigationProperty Name="name" Type="type" Nullable="true" Partner="partner" ContainsTarget="false">
                        <ReferentialConstraint Property="property" ReferencedProperty="referencedProperty"/>
                        <OnDelete Action="cascade"/>
                    </NavigationProperty>
                </EntityType>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        let m: Metadata = new Metadata(xml);
        let schema: CsdlSchema = m.schemas[0];
        expect(schema.entityTypes).toEqual([
            new CsdlEntityType('name', undefined, undefined, [
                new CsdlNavigationProperty('name', 'type'),
                new CsdlNavigationProperty('name', 'type', true, 'partner', false, [
                    new CsdlReferentialConstraint('property', 'referencedProperty')
                ], new CsdlOnDelete('cascade'))
            ])
        ]);

        xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace" Alias="alias">
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;

        m = new Metadata(xml);
        schema = m.schemas[0];
        expect(schema.namespace).toEqual('namespace');
        expect(schema.alias).toEqual('alias');
    });

    it('test entity types', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityType Name="name"></EntityType>
                <EntityType Name="name" BaseType="baseType" OpenType="true" HasStream="false" Abstract="true"></EntityType>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.entityTypes).toEqual([
            new CsdlEntityType('name'),
            new CsdlEntityType('name', undefined, undefined, undefined, 'baseType', true, false, true)
        ]);
    });

    it('test key', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityType Name="name">
                    <Key>
                        <PropertyRef Name="name"/>
                        <PropertyRef Name="name" Alias="alias"/>
                    </Key>
                </EntityType>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.entityTypes).toEqual([
            new CsdlEntityType('name', new CsdlKey([
                new CsdlPropertyRef('name'),
                new CsdlPropertyRef('name', 'alias')
            ]))
        ]);
    });

    it('test enum types', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EnumType Name="name">
                    <Member Name="name"/>
                </EnumType>
                <EnumType Name="name" UnderlyingType="Edm.Int32" IsFlags="true">
                    <Member Name="name" Value="1"/>
                </EnumType>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.enumTypes).toEqual([
            new CsdlEnumType('name', [
                new CsdlEnumMember('name'),
            ]),
            new CsdlEnumType('name', [
                new CsdlEnumMember('name', 1),
            ], 'Edm.Int32', true)
        ]);
    });

    it('test type definitions', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <TypeDefinition Name="name" UnderlyingType="Edm.Int32"/>
                <TypeDefinition Name="name" UnderlyingType="Edm.Int32" MaxLength="1" Precision="2" Scale="3" Unicode="false" SRID="4">
                    <Annotation Term="term" Qualifier="qualifier"/>
                </TypeDefinition>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.typeDefinitions).toEqual([
            new CsdlTypeDefinition('name', 'Edm.Int32'),
            new CsdlTypeDefinition('name', 'Edm.Int32', 1, 2, 3, false, '4', [
                new CsdlAnnotation('term', 'qualifier')
            ])
        ]);
    });

    it('test actions', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <Action Name="name" />
                <Action Name="name" IsBound="true" EntitySetPath="entitySetPath">
                    <Parameter Name="name" Type="Edm.String" />
                    <ReturnType Type="Edm.String" />
                </Action>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.actions).toEqual([
            new CsdlAction('name'),
            new CsdlAction('name', new CsdlReturnType('Edm.String'), true, 'entitySetPath', [
                new CsdlParameter('name', 'Edm.String')
            ])
        ]);
    });

    it('test functions', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <Function Name="name">
                    <ReturnType Type="Edm.String" />
                </Function>
                <Function Name="name" IsBound="true" EntitySetPath="entitySetPath" IsComposable="false">
                    <Parameter Name="name" Type="Edm.String" />
                    <ReturnType Type="Edm.String" />
                </Function>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.functions).toEqual([
            new CsdlFunction('name', new CsdlReturnType('Edm.String')),
            new CsdlFunction('name', new CsdlReturnType('Edm.String'), true, 'entitySetPath', false, [
                new CsdlParameter('name', 'Edm.String')
            ])
        ]);
    });

    it('test return types', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <Function Name="name">
                    <ReturnType Type="Edm.String" />
                </Function>
                <Function Name="name">
                    <ReturnType Type="Edm.String" Nullable="true" MaxLength="1" Precision="2" Scale="3" SRID="4" />
                </Function>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.functions).toEqual([
            new CsdlFunction('name', new CsdlReturnType('Edm.String')),
            new CsdlFunction('name', new CsdlReturnType('Edm.String', true, 1, 2, 3, '4'))
        ]);
    });

    it('test parameters', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <Function Name="name">
                    <ReturnType Type="Edm.String" />
                    <Parameter Name="name" Type="Edm.String" />
                </Function>
                <Function Name="name">
                    <ReturnType Type="Edm.String" />
                    <Parameter Name="name" Type="Edm.String" Nullable="true" MaxLength="1" Precision="2" Scale="3" SRID="4" />
                </Function>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.functions).toEqual([
            new CsdlFunction('name', new CsdlReturnType('Edm.String'), undefined, undefined, undefined, [
                new CsdlParameter('name', 'Edm.String')
            ]),
            new CsdlFunction('name', new CsdlReturnType('Edm.String'), undefined, undefined, undefined, [
                new CsdlParameter('name', 'Edm.String', true, 1, 2, 3, '4')
            ]),
        ]);
    });

    it('test entity container', () => {
        let xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityContainer Name="name" />
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        let m: Metadata = new Metadata(xml);
        let schema: CsdlSchema = m.schemas[0];
        expect(schema.entityContainer).toEqual(
            new CsdlEntityContainer('name')
        );

        xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityContainer Name="name" Extends="extends" />
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        m = new Metadata(xml);
        schema = m.schemas[0];
        expect(schema.entityContainer).toEqual(
            new CsdlEntityContainer('name', 'extends')
        );
    });

    it('test entity sets', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityContainer>
                    <EntitySet Name="name" EntityType="entityType"/>
                    <EntitySet Name="name" EntityType="entityType" IncludeInServiceDocument="true">
                        <NavigationPropertyBinding Path="path" Target="target" />
                    </EntitySet>
                </EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.entityContainer.entitySets).toEqual([
            new CsdlEntitySet('name', 'entityType'),
            new CsdlEntitySet('name', 'entityType', [
                new CsdlNavigationPropertyBinding('path', 'target')
            ], true)
        ]);
    });

    it('test singletons', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityContainer>
                    <Singleton Name="name" Type="type"/>
                    <Singleton Name="name" Type="type">
                        <NavigationPropertyBinding Path="path" Target="target" />
                    </Singleton>
                </EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.entityContainer.singletons).toEqual([
            new CsdlSingleton('name', 'type'),
            new CsdlSingleton('name', 'type', [
                new CsdlNavigationPropertyBinding('path', 'target')
            ])
        ]);
    });

    it('test action imports', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityContainer>
                    <ActionImport Name="name" Action="action" />
                    <ActionImport Name="name" Action="action" EntitySet="entitySet"/>
                </EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.entityContainer.actionImports).toEqual([
            new CsdlActionImport('name', 'action'),
            new CsdlActionImport('name', 'action', 'entitySet')
        ]);
    });

    it('test function imports', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <EntityContainer>
                    <FunctionImport Name="name" Function="action" />
                    <FunctionImport Name="name" Function="action" EntitySet="entitySet" IncludeInServiceDocument="true"/>
                </EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.entityContainer.functionImports).toEqual([
            new CsdlFunctionImport('name', 'action'),
            new CsdlFunctionImport('name', 'action', 'entitySet', true)
        ]);
    });

    it('test terms', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <Term Name="name" Type="Edm.String" />
                <Term Name="name" Type="Edm.String" BaseTerm="baseTerm" DefaultValue="defaultValue" AppliesTo="Property" Nullable="true" MaxLength="1" Precision="2" Scale="3" SRID="4" />
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.terms).toEqual([
            new CsdlTerm('name', 'Edm.String'),
            new CsdlTerm('name', 'Edm.String', 'baseTerm', 'defaultValue', 'Property', true, 1, 2, 3, '4')
        ]);
    });

    it('test schema annotations list', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <Annotations Target="target">
                    <Annotation Term="term" />
                </Annotations>
                <Annotations Target="target" Qualifier="qualifier">
                    <Annotation Term="term" />
                </Annotations>
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.annotationsList).toEqual([
            new CsdlAnnotations('target', [
                new CsdlAnnotation('term')
            ]),
            new CsdlAnnotations('target', [
                new CsdlAnnotation('term')
            ], 'qualifier'),
        ]);
    });

    it('test schema annotation list', () => {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
          <edmx:DataServices>
            <Schema Namespace="namespace">
                <Annotation Term="term" />
                <Annotation Term="term" Qualifier="qualifier" />
                <EntityContainer></EntityContainer>
            </Schema>
          </edmx:DataServices>
        </edmx:Edmx>`;
        const m: Metadata = new Metadata(xml);
        const schema: CsdlSchema = m.schemas[0];
        expect(schema.annotationList).toEqual([
            new CsdlAnnotation('term'),
            new CsdlAnnotation('term', 'qualifier')
        ]);
    });

    const metadata: Metadata = new Metadata(XML_EXAMPLE);
    const schemas: CsdlSchema[] = metadata.schemas;

    it('test enumTypes', () => {
        const schema: CsdlSchema = schemas[0];
        expect(schema.enumTypes).toEqual([
            new CsdlEnumType('PersonGender', [
                new CsdlEnumMember('Male', 0),
                new CsdlEnumMember('Female', 1),
                new CsdlEnumMember('Unknown', 2)
            ])
        ]);
    });

    it('test complexTypes', () => {
        const schema: CsdlSchema = schemas[0];
        expect(schema.complexTypes).toEqual([
            new CsdlComplexType('City', [
                new CsdlProperty('CountryRegion', 'Edm.String', false),
                new CsdlProperty('Name', 'Edm.String', false),
                new CsdlProperty('Region', 'Edm.String', false)
            ]),
            new CsdlComplexType('Location', [
                new CsdlProperty('Address', 'Edm.String', false),
                new CsdlProperty('City', 'Microsoft.OData.SampleService.Models.TripPin.City', false),
            ], undefined, undefined, true),
            new CsdlComplexType('EventLocation', [
                new CsdlProperty('BuildingInfo', 'Edm.String')
            ], undefined, 'Microsoft.OData.SampleService.Models.TripPin.Location', true),
            new CsdlComplexType('AirportLocation', [
                new CsdlProperty('Loc', 'Edm.GeographyPoint', false, undefined, undefined, undefined, undefined, '4326')
            ], undefined, 'Microsoft.OData.SampleService.Models.TripPin.Location', true)
        ]);
    });

    it('test entityTypes', () => {
        const schema: CsdlSchema = schemas[0];
        expect(schema.entityTypes).toEqual([
            new CsdlEntityType('Photo', new CsdlKey([new CsdlPropertyRef('Id')]), [
                new CsdlProperty('Id', 'Edm.Int64', false),
                new CsdlProperty('Name', 'Edm.String')
            ], undefined, undefined, undefined, true),
            new CsdlEntityType('Person', new CsdlKey([new CsdlPropertyRef('UserName')]), [
                new CsdlProperty('UserName', 'Edm.String', false),
                new CsdlProperty('FirstName', 'Edm.String', false),
                new CsdlProperty('LastName', 'Edm.String', false),
                new CsdlProperty('Emails', 'Collection(Edm.String)'),
                new CsdlProperty('AddressInfo', 'Collection(Microsoft.OData.SampleService.Models.TripPin.Location)'),
                new CsdlProperty('Gender', 'Microsoft.OData.SampleService.Models.TripPin.PersonGender'),
                new CsdlProperty('Concurrency', 'Edm.Int64', false),
            ], [
                    new CsdlNavigationProperty('Friends', 'Collection(Microsoft.OData.SampleService.Models.TripPin.Person)'),
                    new CsdlNavigationProperty('Trips', 'Collection(Microsoft.OData.SampleService.Models.TripPin.Trip)', undefined, undefined, true),
                    new CsdlNavigationProperty('Photo', 'Microsoft.OData.SampleService.Models.TripPin.Photo')
                ], undefined, true),
            new CsdlEntityType('Airline', new CsdlKey([new CsdlPropertyRef('AirlineCode')]), [
                new CsdlProperty('AirlineCode', 'Edm.String', false),
                new CsdlProperty('Name', 'Edm.String', false)
            ]),
            new CsdlEntityType('Airport', new CsdlKey([new CsdlPropertyRef('IcaoCode')]), [
                new CsdlProperty('IcaoCode', 'Edm.String', false),
                new CsdlProperty('Name', 'Edm.String', false),
                new CsdlProperty('IataCode', 'Edm.String', false),
                new CsdlProperty('Location', 'Microsoft.OData.SampleService.Models.TripPin.AirportLocation', false)
            ]),
            new CsdlEntityType('PlanItem', new CsdlKey([new CsdlPropertyRef('PlanItemId')]), [
                new CsdlProperty('PlanItemId', 'Edm.Int32', false),
                new CsdlProperty('ConfirmationCode', 'Edm.String'),
                new CsdlProperty('StartsAt', 'Edm.DateTimeOffset'),
                new CsdlProperty('EndsAt', 'Edm.DateTimeOffset'),
                new CsdlProperty('Duration', 'Edm.Duration')
            ]),
            new CsdlEntityType('PublicTransportation', undefined, [
                new CsdlProperty('SeatNumber', 'Edm.String')
            ], undefined, 'Microsoft.OData.SampleService.Models.TripPin.PlanItem'),
            new CsdlEntityType('Flight', undefined, [
                new CsdlProperty('FlightNumber', 'Edm.String', false)
            ], [
                    new CsdlNavigationProperty('From', 'Microsoft.OData.SampleService.Models.TripPin.Airport', false),
                    new CsdlNavigationProperty('To', 'Microsoft.OData.SampleService.Models.TripPin.Airport', false),
                    new CsdlNavigationProperty('Airline', 'Microsoft.OData.SampleService.Models.TripPin.Airline', false)
                ], 'Microsoft.OData.SampleService.Models.TripPin.PublicTransportation'),
            new CsdlEntityType('Event', undefined, [
                new CsdlProperty('Description', 'Edm.String'),
                new CsdlProperty('OccursAt', 'Microsoft.OData.SampleService.Models.TripPin.EventLocation', false),
            ], undefined, 'Microsoft.OData.SampleService.Models.TripPin.PlanItem', true),
            new CsdlEntityType('Trip', new CsdlKey([new CsdlPropertyRef('TripId')]), [
                new CsdlProperty('TripId', 'Edm.Int32', false),
                new CsdlProperty('ShareId', 'Edm.Guid'),
                new CsdlProperty('Description', 'Edm.String'),
                new CsdlProperty('Name', 'Edm.String', false),
                new CsdlProperty('Budget', 'Edm.Single', false),
                new CsdlProperty('StartsAt', 'Edm.DateTimeOffset', false),
                new CsdlProperty('EndsAt', 'Edm.DateTimeOffset', false),
                new CsdlProperty('Tags', 'Collection(Edm.String)', false),
            ], [
                    new CsdlNavigationProperty('Photos', 'Collection(Microsoft.OData.SampleService.Models.TripPin.Photo)'),
                    new CsdlNavigationProperty('PlanItems', 'Collection(Microsoft.OData.SampleService.Models.TripPin.PlanItem)', undefined, undefined, true),
                ])
        ]);
    });

    it('test functions', () => {
        const schema: CsdlSchema = schemas[0];
        expect(schema.functions).toEqual([
            new CsdlFunction('GetFavoriteAirline', new CsdlReturnType('Microsoft.OData.SampleService.Models.TripPin.Airline', false), true, 'person/Trips/PlanItems/Microsoft.OData.SampleService.Models.TripPin.Flight/Airline', true, [
                new CsdlParameter('person', 'Microsoft.OData.SampleService.Models.TripPin.Person', false)
            ]),
            new CsdlFunction('GetInvolvedPeople', new CsdlReturnType('Collection(Microsoft.OData.SampleService.Models.TripPin.Person)', false), true, undefined, true, [
                new CsdlParameter('trip', 'Microsoft.OData.SampleService.Models.TripPin.Trip', false)
            ]),
            new CsdlFunction('GetFriendsTrips', new CsdlReturnType('Collection(Microsoft.OData.SampleService.Models.TripPin.Trip)', false), true, 'person/Friends/Trips', true, [
                new CsdlParameter('person', 'Microsoft.OData.SampleService.Models.TripPin.Person', false),
                new CsdlParameter('userName', 'Edm.String', false)
            ]),
            new CsdlFunction('GetNearestAirport', new CsdlReturnType('Microsoft.OData.SampleService.Models.TripPin.Airport', false), undefined, undefined, true, [
                new CsdlParameter('lat', 'Edm.Double', false),
                new CsdlParameter('lon', 'Edm.Double', false)
            ]),
        ]);
    });

    it('test actions', () => {
        const schema: CsdlSchema = schemas[0];
        expect(schema.actions).toEqual([
            new CsdlAction('ResetDataSource'),
            new CsdlAction('ShareTrip', undefined, true, undefined, [
                new CsdlParameter('person', 'Microsoft.OData.SampleService.Models.TripPin.Person', false),
                new CsdlParameter('userName', 'Edm.String', false),
                new CsdlParameter('tripId', 'Edm.Int32', false)
            ])
        ]);
    });

    it('test entity container', () => {
        const schema: CsdlSchema = schemas[0];
        expect(schema.entityContainer).toEqual(new CsdlEntityContainer(
            'DefaultContainer', undefined,
            [
                new CsdlEntitySet('Photos', 'Microsoft.OData.SampleService.Models.TripPin.Photo'),
                new CsdlEntitySet('People', 'Microsoft.OData.SampleService.Models.TripPin.Person', [
                    new CsdlNavigationPropertyBinding('Friends', 'People'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Flight/Airline', 'Airlines'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Flight/From', 'Airports'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Flight/To', 'Airports'),
                    new CsdlNavigationPropertyBinding('Photo', 'Photos'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Trip/Photos', 'Photos')
                ]),
                new CsdlEntitySet('Airlines', 'Microsoft.OData.SampleService.Models.TripPin.Airline'),
                new CsdlEntitySet('Airports', 'Microsoft.OData.SampleService.Models.TripPin.Airport'),
            ],
            [
                new CsdlSingleton('Me', 'Microsoft.OData.SampleService.Models.TripPin.Person', [
                    new CsdlNavigationPropertyBinding('Friends', 'People'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Flight/Airline', 'Airlines'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Flight/From', 'Airports'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Flight/To', 'Airports'),
                    new CsdlNavigationPropertyBinding('Photo', 'Photos'),
                    new CsdlNavigationPropertyBinding('Microsoft.OData.SampleService.Models.TripPin.Trip/Photos', 'Photos')
                ])
            ],
            [
                new CsdlFunctionImport('GetNearestAirport', 'Microsoft.OData.SampleService.Models.TripPin.GetNearestAirport', 'Airports', true)
            ],
            [
                new CsdlActionImport('ResetDataSource', 'Microsoft.OData.SampleService.Models.TripPin.ResetDataSource')
            ],
        ));
    });
});
